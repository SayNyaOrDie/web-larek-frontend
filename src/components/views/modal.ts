import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import { AppEvents } from '../../types';
import type { IEvents } from '../base/events';
import type { IModalView } from '../../types';

export class Modal extends Component<object> implements IModalView {
	protected closeButton: HTMLButtonElement;
	protected contentElement: HTMLElement;

	constructor(container: HTMLElement, protected readonly events: IEvents) {
		super(container);

		this.closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this.contentElement = ensureElement<HTMLElement>(
			'.modal__content',
			container
		);

		this.closeButton.addEventListener('click', () => {
			this.events.emit(AppEvents.modalClose, {});
		});

		this.container.addEventListener('click', (event) => {
			if (event.target === this.container) {
				this.events.emit(AppEvents.modalClose, {});
			}
		});
	}

	setContent(content: HTMLElement): void {
		this.setChildren(this.contentElement, [content]);
	}

	open(): void {
		this.toggleClass(this.container, 'modal_active', true);
	}

	close(): void {
		this.toggleClass(this.container, 'modal_active', false);
		this.setChildren(this.contentElement, []);
	}
}
