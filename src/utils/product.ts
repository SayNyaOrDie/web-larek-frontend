import { CATEGORY_MODIFIER_MAP, CDN_URL } from './constants';
import type { CategoryModifier, ProductCategory } from '../types';

export function formatPrice(price: number | null): string {
	return price === null ? 'Бесценно' : `${price} синапсов`;
}

export function getProductImageUrl(image: string): string {
	return `${CDN_URL}${image}`;
}

export function getCategoryModifier(
	category: ProductCategory
): CategoryModifier {
	return CATEGORY_MODIFIER_MAP[category] ?? 'other';
}
