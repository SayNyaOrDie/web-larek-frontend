import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import { AppEvents } from '../../types';
import type { IEvents } from '../base/events';
import type { IPageView } from '../../types';

export class Page extends Component<object> implements IPageView {
	protected counterElement: HTMLElement;
	protected catalogElement: HTMLElement;
	protected wrapperElement: HTMLElement;
	protected basketButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected readonly events: IEvents) {
		super(container);

		this.counterElement = ensureElement<HTMLElement>(
			'.header__basket-counter',
			container
		);
		this.catalogElement = ensureElement<HTMLElement>('.gallery', container);
		this.wrapperElement = ensureElement<HTMLElement>(
			'.page__wrapper',
			container
		);
		this.basketButton = ensureElement<HTMLButtonElement>(
			'.header__basket',
			container
		);

		this.basketButton.addEventListener('click', () => {
			this.events.emit(AppEvents.basketOpen, {});
		});
	}

	setCatalog(items: HTMLElement[]): void {
		this.setChildren(this.catalogElement, items);
	}

	setCounter(value: number): void {
		this.setText(this.counterElement, String(value));
	}

	setLocked(value: boolean): void {
		this.toggleClass(this.wrapperElement, 'page__wrapper_locked', value);
	}
}
