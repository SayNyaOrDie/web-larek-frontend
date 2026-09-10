import type { IComponent } from '../../types';

export abstract class Component<TData> implements IComponent<TData> {
	protected constructor(protected readonly container: HTMLElement) {}

	render(data?: Partial<TData>): HTMLElement {
		void data;
		return this.container;
	}

	protected setText(element: HTMLElement, value: string): void {
		element.textContent = value;
	}

	protected setImage(
		element: HTMLImageElement,
		src: string,
		alt?: string
	): void {
		element.src = src;
		if (alt !== undefined) {
			element.alt = alt;
		}
	}

	protected toggleClass(
		element: HTMLElement,
		className: string,
		force?: boolean
	): void {
		element.classList.toggle(className, force);
	}

	protected setDisabled(
		element: HTMLButtonElement,
		disabled: boolean
	): void {
		element.disabled = disabled;
	}

	protected setChildren(
		element: HTMLElement,
		children: HTMLElement[]
	): void {
		element.replaceChildren(...children);
	}
}
