import { AppEvents } from '../../types';
import type { IEvents } from '../base/events';
import type {
	IBasketModel,
	IProductView,
	ProductId,
} from '../../types';

export class BasketModel implements IBasketModel {
	protected items: IProductView[] = [];

	constructor(protected readonly events: IEvents) {}

	add(product: IProductView): void {
		if (!product.isPurchasable || this.has(product.id)) {
			return;
		}

		this.items.push(product);
		this.changed();
	}

	remove(id: ProductId): void {
		this.items = this.items.filter((item) => item.id !== id);
		this.changed();
	}

	has(id: ProductId): boolean {
		return this.items.some((item) => item.id === id);
	}

	clear(): void {
		this.items = [];
		this.changed();
	}

	getItems(): IProductView[] {
		return this.items;
	}

	getTotal(): number {
		return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
	}

	protected changed(): void {
		this.events.emit(AppEvents.basketChanged, {});
	}
}
