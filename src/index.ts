import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { WebLarekApi } from './components/api/webLarekApi';
import { CatalogModel } from './components/models/catalog';
import { BasketModel } from './components/models/basket';
import { OrderModel } from './components/models/order';
import { Page } from './components/views/page';
import { Modal } from './components/views/modal';
import { Basket } from './components/views/basket';
import { BasketItem, CatalogCard, PreviewCard } from './components/views/card';
import { ContactsForm, OrderForm } from './components/views/form';
import { Success } from './components/views/success';
import { API_URL } from './utils/constants';
import { formatPrice } from './utils/product';
import { cloneTemplate, ensureElement } from './utils/utils';
import { AppEvents } from './types';
import type {
	IOrderRequest,
	OrderFieldChange,
	ProductId,
} from './types';

const events = new EventEmitter();
const api = new WebLarekApi(API_URL);

const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const orderModel = new OrderModel(events);

const page = new Page(document.body, events);
const modal = new Modal(
	ensureElement<HTMLElement>('#modal-container'),
	events
);
const previewCard = new PreviewCard(
	cloneTemplate<HTMLElement>('#card-preview'),
	events
);
const basket = new Basket(cloneTemplate<HTMLElement>('#basket'), events);
const orderForm = new OrderForm(
	cloneTemplate<HTMLFormElement>('#order'),
	events
);
const contactsForm = new ContactsForm(
	cloneTemplate<HTMLFormElement>('#contacts'),
	events
);
const success = new Success(cloneTemplate<HTMLElement>('#success'), events);

function openModal(content: HTMLElement): void {
	modal.setContent(content);
	modal.open();
	page.setLocked(true);
}

function closeModal(): void {
	modal.close();
	page.setLocked(false);
}

function renderBasket(): HTMLElement {
	const products = basketModel.getItems();
	const items = products.map((product, index) => {
		const card = new BasketItem(
			cloneTemplate<HTMLLIElement>('#card-basket'),
			events
		);
		return card.render({
			id: product.id,
			title: product.title,
			priceText: product.priceText,
			index: index + 1,
		});
	});

	return basket.render({
		items,
		totalText: formatPrice(basketModel.getTotal()),
		isEmpty: products.length === 0,
	});
}

function renderForms(): void {
	const data = orderModel.getData();
	const errors = orderModel.validate();

	orderForm.render({
		values: {
			payment: data.payment,
			address: data.address,
		},
		errors,
		valid: !errors.payment && !errors.address,
	});

	contactsForm.render({
		values: {
			email: data.email,
			phone: data.phone,
		},
		errors,
		valid: !errors.email && !errors.phone,
	});
}

events.on(AppEvents.catalogChanged, () => {
	const cards = catalogModel.getProducts().map((item) => {
		const card = new CatalogCard(
			cloneTemplate<HTMLButtonElement>('#card-catalog'),
			events
		);
		return card.render({
			id: item.id,
			title: item.title,
			imageUrl: item.imageUrl,
			category: item.category,
			categoryModifier: item.categoryModifier,
			priceText: item.priceText,
		});
	});
	page.setCatalog(cards);
});

events.on<{ id: ProductId }>(AppEvents.catalogSelect, ({ id }) => {
	catalogModel.select(id);
});

events.on(AppEvents.catalogSelected, () => {
	const product = catalogModel.getSelected();
	if (!product) {
		return;
	}

	openModal(
		previewCard.render({
			...product,
			isInBasket: basketModel.has(product.id),
		})
	);
});

events.on<{ id: ProductId }>(AppEvents.basketToggle, ({ id }) => {
	if (basketModel.has(id)) {
		basketModel.remove(id);
		return;
	}

	const product = catalogModel.getProduct(id);
	if (product) {
		basketModel.add(product);
	}
});

events.on<{ id: ProductId }>(AppEvents.basketRemove, ({ id }) => {
	basketModel.remove(id);
});

events.on(AppEvents.basketChanged, () => {
	page.setCounter(basketModel.getItems().length);
	renderBasket();

	const selected = catalogModel.getSelected();
	if (selected) {
		previewCard.render({
			isInBasket: basketModel.has(selected.id),
		});
	}
});

events.on(AppEvents.basketOpen, () => {
	openModal(renderBasket());
});

events.on(AppEvents.checkoutOpen, () => {
	if (basketModel.getItems().length === 0) {
		return;
	}

	renderForms();
	openModal(orderForm.render());
});

events.on<OrderFieldChange>(AppEvents.orderFieldChange, (change) => {
	orderModel.setField(change);
});

events.on(AppEvents.orderChanged, () => {
	renderForms();
});

events.on(AppEvents.orderNext, () => {
	const errors = orderModel.validate();
	if (errors.payment || errors.address) {
		return;
	}

	openModal(contactsForm.render());
});

events.on(AppEvents.orderSubmit, () => {
	const data = orderModel.getData();
	const errors = orderModel.validate();
	const items = basketModel.getItems();

	if (
		Object.keys(errors).length > 0 ||
		!data.payment ||
		items.length === 0
	) {
		return;
	}

	const order: IOrderRequest = {
		payment: data.payment,
		address: data.address.trim(),
		email: data.email.trim(),
		phone: data.phone.trim(),
		items: items.map((item) => item.id),
		total: basketModel.getTotal(),
	};

	api
		.createOrder(order)
		.then((result) => {
			basketModel.clear();
			orderModel.clear();
			renderForms();
			modal.setContent(
				success.render({
					totalText: formatPrice(result.total),
				})
			);
		})
		.catch((error: unknown) => {
			console.error(error);
		});
});

events.on(AppEvents.successClose, () => {
	closeModal();
});

events.on(AppEvents.modalClose, () => {
	closeModal();
});

renderBasket();
renderForms();

api
	.getProducts()
	.then((data) => catalogModel.setProducts(data.items))
	.catch((error: unknown) => {
		console.error(error);
	});
