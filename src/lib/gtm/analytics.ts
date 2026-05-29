'use client';

import { Product } from '@/types';
import { getGtmConfig } from './config';
import { pushDataLayer } from './data-layer';

export const GTM_EVENTS = {
  ADDED_TO_CART: 'added_to_cart',
  REMOVED_FROM_CART: 'removed_from_cart',
  ADDED_TO_WISHLIST: 'added_to_wishlist',
  REMOVED_FROM_WISHLIST: 'removed_from_wishlist',
  PRODUCT_VIEWED: 'product_viewed',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  CART_CLEARED: 'cart_cleared',
} as const;

function productPayload(product: Product) {
  return {
    product_id: product.id,
    product_name: product.name,
    product_category: product.category,
    product_price: product.price,
    currency: 'KRW',
  };
}

function isEnabled(): boolean {
  return getGtmConfig().enabled;
}

export function trackGtmProductView(product: Product): void {
  if (!isEnabled()) return;

  pushDataLayer({
    event: GTM_EVENTS.PRODUCT_VIEWED,
    ...productPayload(product),
  });
}

type GtmStoreAction =
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'ADD_TO_WISHLIST'; payload: Product }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'LOGIN'; payload: { name: string; email: string } }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_CART' };

export function trackGtmStoreAction(action: { type: string; payload?: unknown }): void {
  if (!isEnabled()) return;

  switch (action.type) {
    case 'ADD_TO_CART':
      pushDataLayer({
        event: GTM_EVENTS.ADDED_TO_CART,
        ...productPayload((action as GtmStoreAction & { type: 'ADD_TO_CART' }).payload),
      });
      break;
    case 'REMOVE_FROM_CART':
      pushDataLayer({
        event: GTM_EVENTS.REMOVED_FROM_CART,
        product_id: (action as GtmStoreAction & { type: 'REMOVE_FROM_CART' }).payload,
      });
      break;
    case 'ADD_TO_WISHLIST':
      pushDataLayer({
        event: GTM_EVENTS.ADDED_TO_WISHLIST,
        ...productPayload((action as GtmStoreAction & { type: 'ADD_TO_WISHLIST' }).payload),
      });
      break;
    case 'REMOVE_FROM_WISHLIST':
      pushDataLayer({
        event: GTM_EVENTS.REMOVED_FROM_WISHLIST,
        product_id: (action as GtmStoreAction & { type: 'REMOVE_FROM_WISHLIST' }).payload,
      });
      break;
    case 'LOGIN': {
      const { email, name } = (action as GtmStoreAction & { type: 'LOGIN' }).payload;
      pushDataLayer({
        event: GTM_EVENTS.USER_LOGIN,
        user_id: email,
        email,
        name,
      });
      break;
    }
    case 'LOGOUT':
      pushDataLayer({
        event: GTM_EVENTS.USER_LOGOUT,
      });
      break;
    case 'CLEAR_CART':
      pushDataLayer({
        event: GTM_EVENTS.CART_CLEARED,
      });
      break;
    default:
      break;
  }
}
