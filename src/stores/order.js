import { writable, derived } from 'svelte/store'

export const productId = writable(localStorage.getItem('productId') || 1);
export const product = writable({});

export const currencyLabel = writable(localStorage.getItem('currencyLabel') || 'weth');
export const currency = writable();

export const amount = writable();
export const leverage = writable();

export const isSubmittingLong = writable(false);
export const isSubmittingShort = writable(false);

export const margin = derived([amount, leverage], ([$amount, $leverage]) => {
	if (!$amount || !$leverage) return 0;
	return ($amount || 0) / $leverage;
}, 0);