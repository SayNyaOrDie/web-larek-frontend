import type { CategoryModifier, ProductCategory } from '../types';

export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const CATEGORY_MODIFIER_MAP: Record<ProductCategory, CategoryModifier> = {
	'софт-скил': 'soft',
	'хард-скил': 'hard',
	'другое': 'other',
	'дополнительное': 'additional',
	'кнопка': 'button',
};

export const settings = {

};
