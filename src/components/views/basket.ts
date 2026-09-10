import { Component } from '../base/component';
import { createElement, ensureElement } from '../../utils/utils';
import { AppEvents } from '../../types';
import type { IEvents } from '../base/events';
import type { IBasketRenderData } from '../../types';

export class Basket extends Component<IBasketRenderData> {
	protected listElement: HTMLElement;
	protected totalElement: HTMLElement;
	protected buttonElement: HTMLButtonElement;

	constructor(container: HTMLElement, protected readonly events: IEvents) {
		super(container);

		this.listElement = ensureElement<HTMLElement>(
			'.basket__list',
			container
		);
		this.totalElement = ensureElement<HTMLElement>(
			'.basket__price',
			container
		);
		this.buttonElement = ensureElement<HTMLButtonElement>(
			'.basket__button',
			container
		);

		this.buttonElement.addEventListener('click', () => {
			this.events.emit(AppEvents.checkoutOpen, {});
		});

		this.setDisabled(this.buttonElement, true);
		this.showEmpty();
	}

	render(data?: Partial<IBasketRenderData>): HTMLElement {
		if (data?.items !== undefined) {
			if (data.isEmpty ?? data.items.length === 0) {
				this.showEmpty();
			} else {
				this.setChildren(this.listElement, data.items);
			}
		}

		if (data?.totalText !== undefined) {
			this.setText(this.totalElement, data.totalText);
		}

		if (data?.isEmpty !== undefined) {
			this.setDisabled(this.buttonElement, data.isEmpty);
		}

		return this.container;
	}

	protected showEmpty(): void {
		this.setChildren(this.listElement, [
			createElement('li', { textContent: 'Корзина пуста' }),
		]);
	}
}
