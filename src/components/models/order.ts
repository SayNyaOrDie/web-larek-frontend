import { AppEvents } from '../../types';
import type { IEvents } from '../base/events';
import type {
	IBuyerDraft,
	FormErrors,
	IOrderModel,
	OrderFieldChange,
} from '../../types';

const emptyDraft = (): IBuyerDraft => ({
	payment: null,
	address: '',
	email: '',
	phone: '',
});

export class OrderModel implements IOrderModel {
	protected draft: IBuyerDraft = emptyDraft();

	constructor(protected readonly events: IEvents) {}

	setField(change: OrderFieldChange): void {
		if (change.field === 'payment') {
			this.draft.payment = change.value;
		} else {
			this.draft[change.field] = change.value;
		}

		this.events.emit(AppEvents.orderChanged, {});
	}

	getData(): IBuyerDraft {
		return { ...this.draft };
	}

	validate(): FormErrors {
		const errors: FormErrors = {};

		if (!this.draft.payment) {
			errors.payment = 'Выберите способ оплаты';
		}

		if (!this.draft.address.trim()) {
			errors.address = 'Введите адрес доставки';
		}

		if (!this.draft.email.trim()) {
			errors.email = 'Укажите email';
		}

		if (!this.draft.phone.trim()) {
			errors.phone = 'Укажите телефон';
		}

		return errors;
	}

	clear(): void {
		this.draft = emptyDraft();
	}
}
