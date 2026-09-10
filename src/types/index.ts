import type { ApiListResponse } from '../components/base/api';

export type ProductId = string;

export type ProductCategory =
	| 'софт-скил'
	| 'хард-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка';

export type CategoryModifier =
	| 'soft'
	| 'hard'
	| 'other'
	| 'additional'
	| 'button';

export interface IProduct {
	id: ProductId;
	title: string;
	description: string;
	image: string;
	category: ProductCategory;
	price: number | null;
}

export interface IProductView extends Omit<IProduct, 'image'> {
	imageUrl: string;
	categoryModifier: CategoryModifier;
	priceText: string;
	isPurchasable: boolean;
}

export type CatalogCardData = Pick<
	IProductView,
	'id' | 'title' | 'imageUrl' | 'category' | 'categoryModifier' | 'priceText'
>;

export interface IPreviewCardData extends IProductView {
	isInBasket: boolean;
}

export interface IBasketItemData
	extends Pick<IProductView, 'id' | 'title' | 'priceText'> {
	index: number;
}

export interface IBasketRenderData {
	items: HTMLElement[];
	totalText: string;
	isEmpty: boolean;
}

export type PaymentMethod = 'card' | 'cash';
export type BuyerField = 'payment' | 'address' | 'email' | 'phone';

export interface IBuyerDraft {
	payment: PaymentMethod | null;
	address: string;
	email: string;
	phone: string;
}

export interface IOrderRequest {
	payment: PaymentMethod;
	address: string;
	email: string;
	phone: string;
	total: number;
	items: ProductId[];
}

export interface IOrderResult {
	id: string;
	total: number;
}

export type FormErrors = Partial<Record<BuyerField, string>>;
export type ProductListResponse = ApiListResponse<IProduct>;

export interface IShopApi {
	getProducts(): Promise<ProductListResponse>;
	createOrder(order: IOrderRequest): Promise<IOrderResult>;
}

export type OrderFieldChange =
	| { field: 'payment'; value: PaymentMethod }
	| { field: Exclude<BuyerField, 'payment'>; value: string };

export type EmptyPayload = Record<string, never>;

export const AppEvents = {
	catalogChanged: 'catalog:changed',
	catalogSelect: 'catalog:select',
	catalogSelected: 'catalog:selected',
	basketOpen: 'basket:open',
	basketToggle: 'basket:toggle',
	basketRemove: 'basket:remove',
	basketChanged: 'basket:changed',
	checkoutOpen: 'checkout:open',
	orderFieldChange: 'order:field-change',
	orderChanged: 'order:changed',
	orderNext: 'order:next',
	orderSubmit: 'order:submit',
	modalClose: 'modal:close',
	successClose: 'success:close',
} as const;

export type AppEventName = (typeof AppEvents)[keyof typeof AppEvents];

export interface IAppEventMap {
	'catalog:changed': EmptyPayload;
	'catalog:select': { id: ProductId };
	'catalog:selected': EmptyPayload;
	'basket:open': EmptyPayload;
	'basket:toggle': { id: ProductId };
	'basket:remove': { id: ProductId };
	'basket:changed': EmptyPayload;
	'checkout:open': EmptyPayload;
	'order:field-change': OrderFieldChange;
	'order:changed': EmptyPayload;
	'order:next': EmptyPayload;
	'order:submit': EmptyPayload;
	'modal:close': EmptyPayload;
	'success:close': EmptyPayload;
}

export interface IComponent<TData> {
	render(data?: Partial<TData>): HTMLElement;
}

export interface ICatalogModel {
	setProducts(products: IProduct[]): void;
	getProducts(): IProductView[];
	getProduct(id: ProductId): IProductView | undefined;
	select(id: ProductId): void;
	getSelected(): IProductView | null;
}

export interface IBasketModel {
	add(product: IProductView): void;
	remove(id: ProductId): void;
	has(id: ProductId): boolean;
	clear(): void;
	getItems(): IProductView[];
	getTotal(): number;
}

export interface IOrderModel {
	setField(change: OrderFieldChange): void;
	getData(): IBuyerDraft;
	validate(): FormErrors;
	clear(): void;
}

export interface IPageView {
	setCatalog(items: HTMLElement[]): void;
	setCounter(value: number): void;
	setLocked(value: boolean): void;
}

export interface IModalView {
	setContent(content: HTMLElement): void;
	open(): void;
	close(): void;
}

export interface IFormRenderData<TValues extends object> {
	values: TValues;
	errors: FormErrors;
	valid: boolean;
}

export interface IFormView<TValues extends object> {
	render(data?: Partial<IFormRenderData<TValues>>): HTMLElement;
}

export type DeliveryFormValues = Pick<IBuyerDraft, 'payment' | 'address'>;
export type ContactsFormValues = Pick<IBuyerDraft, 'email' | 'phone'>;

export interface ISuccessViewData {
	totalText: string;
}
