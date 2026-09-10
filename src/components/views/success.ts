import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import { AppEvents } from '../../types';
import type { IEvents } from '../base/events';
import type { ISuccessViewData } from '../../types';

export class Success extends Component<ISuccessViewData> {
	protected descriptionElement: HTMLElement;
	protected closeButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected readonly events: IEvents) {
		super(container);

		this.descriptionElement = ensureElement<HTMLElement>(
			'.order-success__description',
			container
		);
		this.closeButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			container
		);

		this.closeButton.addEventListener('click', () => {
			this.events.emit(AppEvents.successClose, {});
		});
	}

	render(data?: Partial<ISuccessViewData>): HTMLElement {
		if (data?.totalText !== undefined) {
			this.setText(
				this.descriptionElement,
				`Списано ${data.totalText}`
			);
		}

		return this.container;
	}
}
