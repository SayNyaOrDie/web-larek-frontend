import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import { AppEvents } from '../../types';
import type { IEvents } from '../base/events';
import type {
	CatalogCardData,
	CategoryModifier,
	IBasketItemData,
	IPreviewCardData,
	ProductId,
} from '../../types';

export abstract class Card<
	T extends { title: string; priceText: string }
> extends Component<T> {
	protected titleElement: HTMLElement;
	protected priceElement: HTMLElement;
	protected productId: ProductId | null = null;

	protected constructor(container: HTMLElement) {
		super(container);
		this.titleElement = ensureElement<HTMLElement>(
			'.card__title',
			container
		);
		this.priceElement = ensureElement<HTMLElement>(
			'.card__price',
			container
		);
	}

	protected applyTitle(value: string): void {
		this.setText(this.titleElement, value);
	}

	protected applyPrice(value: string): void {
		this.setText(this.priceElement, value);
	}
}

function applyCategory(
	element: HTMLElement,
	category: string,
	modifier: CategoryModifier
): void {
	element.textContent = category;
	element.className = `card__category card__category_${modifier}`;
}

export class CatalogCard extends Card<CatalogCardData> {
	protected categoryElement: HTMLElement;
	protected imageElement: HTMLImageElement;

	constructor(
		container: HTMLElement,
		protected readonly events: IEvents
	) {
		super(container);
		this.categoryElement = ensureElement<HTMLElement>(
			'.card__category',
			container
		);
		this.imageElement = ensureElement<HTMLImageElement>(
			'.card__image',
			container
		);

		this.container.addEventListener('click', () => {
			if (!this.productId) {
				return;
			}
			this.events.emit(AppEvents.catalogSelect, { id: this.productId });
		});
	}

	render(data?: Partial<CatalogCardData>): HTMLElement {
		if (data?.id !== undefined) {
			this.productId = data.id;
		}
		if (data?.title !== undefined) {
			this.applyTitle(data.title);
			this.imageElement.alt = data.title;
		}
		if (data?.priceText !== undefined) {
			this.applyPrice(data.priceText);
		}
		if (data?.imageUrl !== undefined) {
			this.setImage(this.imageElement, data.imageUrl);
		}
		if (
			data?.category !== undefined &&
			data.categoryModifier !== undefined
		) {
			applyCategory(
				this.categoryElement,
				data.category,
				data.categoryModifier
			);
		}

		return this.container;
	}
}

export class PreviewCard extends Card<IPreviewCardData> {
	protected categoryElement: HTMLElement;
	protected imageElement: HTMLImageElement;
	protected descriptionElement: HTMLElement;
	protected buttonElement: HTMLButtonElement;

	constructor(
		container: HTMLElement,
		protected readonly events: IEvents
	) {
		super(container);
		this.categoryElement = ensureElement<HTMLElement>(
			'.card__category',
			container
		);
		this.imageElement = ensureElement<HTMLImageElement>(
			'.card__image',
			container
		);
		this.descriptionElement = ensureElement<HTMLElement>(
			'.card__text',
			container
		);
		this.buttonElement = ensureElement<HTMLButtonElement>(
			'.card__button',
			container
		);

		this.buttonElement.addEventListener('click', () => {
			if (!this.productId) {
				return;
			}
			this.events.emit(AppEvents.basketToggle, { id: this.productId });
		});
	}

	render(data?: Partial<IPreviewCardData>): HTMLElement {
		if (data?.id !== undefined) {
			this.productId = data.id;
		}
		if (data?.title !== undefined) {
			this.applyTitle(data.title);
			this.imageElement.alt = data.title;
		}
		if (data?.priceText !== undefined) {
			this.applyPrice(data.priceText);
		}
		if (data?.imageUrl !== undefined) {
			this.setImage(this.imageElement, data.imageUrl);
		}
		if (data?.description !== undefined) {
			this.setText(this.descriptionElement, data.description);
		}
		if (
			data?.category !== undefined &&
			data.categoryModifier !== undefined
		) {
			applyCategory(
				this.categoryElement,
				data.category,
				data.categoryModifier
			);
		}
		if (data?.isInBasket !== undefined) {
			this.setText(
				this.buttonElement,
				data.isInBasket ? 'Убрать' : 'Купить'
			);
		}
		if (data?.isPurchasable !== undefined) {
			this.setDisabled(this.buttonElement, !data.isPurchasable);
		}

		return this.container;
	}
}

export class BasketItem extends Card<IBasketItemData> {
	protected indexElement: HTMLElement;
	protected deleteButton: HTMLButtonElement;

	constructor(
		container: HTMLElement,
		protected readonly events: IEvents
	) {
		super(container);
		this.indexElement = ensureElement<HTMLElement>(
			'.basket__item-index',
			container
		);
		this.deleteButton = ensureElement<HTMLButtonElement>(
			'.basket__item-delete',
			container
		);

		this.deleteButton.addEventListener('click', () => {
			if (!this.productId) {
				return;
			}
			this.events.emit(AppEvents.basketRemove, { id: this.productId });
		});
	}

	render(data?: Partial<IBasketItemData>): HTMLElement {
		if (data?.id !== undefined) {
			this.productId = data.id;
		}
		if (data?.title !== undefined) {
			this.applyTitle(data.title);
		}
		if (data?.priceText !== undefined) {
			this.applyPrice(data.priceText);
		}
		if (data?.index !== undefined) {
			this.setText(this.indexElement, String(data.index));
		}

		return this.container;
	}
}
