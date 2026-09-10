import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import { AppEvents } from '../../types';
import type { IEvents } from '../base/events';
import type {
	BuyerField,
	ContactsFormValues,
	DeliveryFormValues,
	FormErrors,
	IFormRenderData,
	IFormView,
	PaymentMethod,
} from '../../types';

export abstract class Form<TValues extends object>
	extends Component<IFormRenderData<TValues>>
	implements IFormView<TValues>
{
	protected submitButton: HTMLButtonElement;
	protected errorsElement: HTMLElement;
	protected valid = false;

	protected constructor(
		container: HTMLFormElement,
		protected readonly events: IEvents
	) {
		super(container);

		this.submitButton = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			container
		);
		this.errorsElement = ensureElement<HTMLElement>(
			'.form__errors',
			container
		);

		container.addEventListener('submit', (event) => {
			event.preventDefault();
			if (!this.valid) {
				return;
			}
			this.onSubmit();
		});

		container.addEventListener('input', (event) => {
			const target = event.target;
			if (target instanceof HTMLInputElement) {
				this.onInputChange(target.name, target.value);
			}
		});
	}

	protected abstract readonly errorFields: BuyerField[];
	protected abstract onSubmit(): void;
	protected abstract onInputChange(field: string, value: string): void;
	protected abstract applyValues(values: Partial<TValues>): void;

	render(data?: Partial<IFormRenderData<TValues>>): HTMLElement {
		if (data?.values) {
			this.applyValues(data.values);
		}

		if (data?.valid !== undefined) {
			this.valid = data.valid;
			this.setDisabled(this.submitButton, !this.valid);
		}

		if (data?.errors !== undefined) {
			this.showErrors(this.pickErrors(data.errors));
		}

		return this.container;
	}

	protected pickErrors(errors: FormErrors): string[] {
		return this.errorFields
			.map((field) => errors[field])
			.filter((message): message is string => Boolean(message));
	}

	protected showErrors(messages: string[]): void {
		this.setText(this.errorsElement, messages.join('; '));
	}
}

export class OrderForm extends Form<DeliveryFormValues> {
	protected readonly errorFields: BuyerField[] = ['payment', 'address'];
	protected cardButton: HTMLButtonElement;
	protected cashButton: HTMLButtonElement;
	protected addressInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.cardButton = ensureElement<HTMLButtonElement>(
			'button[name=card]',
			container
		);
		this.cashButton = ensureElement<HTMLButtonElement>(
			'button[name=cash]',
			container
		);
		this.addressInput = ensureElement<HTMLInputElement>(
			'input[name=address]',
			container
		);

		this.cardButton.addEventListener('click', () => {
			this.events.emit(AppEvents.orderFieldChange, {
				field: 'payment',
				value: 'card',
			});
		});

		this.cashButton.addEventListener('click', () => {
			this.events.emit(AppEvents.orderFieldChange, {
				field: 'payment',
				value: 'cash',
			});
		});
	}

	protected onSubmit(): void {
		this.events.emit(AppEvents.orderNext, {});
	}

	protected onInputChange(field: string, value: string): void {
		if (field === 'address') {
			this.events.emit(AppEvents.orderFieldChange, {
				field: 'address',
				value,
			});
		}
	}

	protected applyValues(values: Partial<DeliveryFormValues>): void {
		if (values.payment !== undefined) {
			this.setPayment(values.payment);
		}

		if (values.address !== undefined) {
			this.addressInput.value = values.address;
		}
	}

	protected setPayment(value: PaymentMethod | null): void {
		this.toggleClass(
			this.cardButton,
			'button_alt-active',
			value === 'card'
		);
		this.toggleClass(
			this.cashButton,
			'button_alt-active',
			value === 'cash'
		);
	}
}

export class ContactsForm extends Form<ContactsFormValues> {
	protected readonly errorFields: BuyerField[] = ['email', 'phone'];
	protected emailInput: HTMLInputElement;
	protected phoneInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.emailInput = ensureElement<HTMLInputElement>(
			'input[name=email]',
			container
		);
		this.phoneInput = ensureElement<HTMLInputElement>(
			'input[name=phone]',
			container
		);
	}

	protected onSubmit(): void {
		this.events.emit(AppEvents.orderSubmit, {});
	}

	protected onInputChange(field: string, value: string): void {
		if (field === 'email' || field === 'phone') {
			this.events.emit(AppEvents.orderFieldChange, {
				field,
				value,
			});
		}
	}

	protected applyValues(values: Partial<ContactsFormValues>): void {
		if (values.email !== undefined) {
			this.emailInput.value = values.email;
		}

		if (values.phone !== undefined) {
			this.phoneInput.value = values.phone;
		}
	}
}
