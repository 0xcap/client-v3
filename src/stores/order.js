import { writable } from 'svelte/store'

export const productId = writable(localStorage.getItem('productId') || 1);
export const product = writable({});

export const currencyLabel = writable(localStorage.getItem('currencyLabel') || 'weth');
export const currency = writable();

export const amount = writable();
export const leverage = writable();

export const isSubmitting = writable(false);