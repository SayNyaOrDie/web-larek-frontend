import { Api } from '../base/api';
import type {
	IOrderRequest,
	IOrderResult,
	IShopApi,
	ProductListResponse,
} from '../../types';

export class WebLarekApi extends Api implements IShopApi {
	getProducts(): Promise<ProductListResponse> {
		return this.get('/product').then(
			(data) => data as ProductListResponse
		);
	}

	createOrder(order: IOrderRequest): Promise<IOrderResult> {
		return this.post('/order', order).then(
			(data) => data as IOrderResult
		);
	}
}
