import {
	formatPrice,
	getCategoryModifier,
	getProductImageUrl,
} from '../../utils/product';
import { AppEvents } from '../../types';
import type { IEvents } from '../base/events';
import type {
	ICatalogModel,
	IProduct,
	IProductView,
	ProductId,
} from '../../types';

export class CatalogModel implements ICatalogModel {
	protected items: IProductView[] = [];
	protected selectedId: ProductId | null = null;

	constructor(protected readonly events: IEvents) {}

	setProducts(products: IProduct[]): void {
		this.items = products.map((product) => this.toView(product));
		this.events.emit(AppEvents.catalogChanged, {});
	}

	getProducts(): IProductView[] {
		return this.items;
	}

	getProduct(id: ProductId): IProductView | undefined {
		return this.items.find((item) => item.id === id);
	}

	select(id: ProductId): void {
		if (!this.getProduct(id)) {
			return;
		}
		this.selectedId = id;
		this.events.emit(AppEvents.catalogSelected, {});
	}

	getSelected(): IProductView | null {
		return this.selectedId ? this.getProduct(this.selectedId) ?? null : null;
	}

	protected toView(product: IProduct): IProductView {
		return {
			id: product.id,
			title: product.title,
			description: product.description,
			category: product.category,
			price: product.price,
			imageUrl: getProductImageUrl(product.image),
			categoryModifier: getCategoryModifier(product.category),
			priceText: formatPrice(product.price),
			isPurchasable: product.price !== null,
		};
	}
}
