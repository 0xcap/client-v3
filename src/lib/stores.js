import { writable, derived } from 'svelte/store'

// History
export const history = writable([]);

// New order
export const productId = writable(localStorage.getItem('productId') || 1);
export const product = writable({});

export const currencyLabel = writable(localStorage.getItem('currencyLabel') || 'weth');
export const currency = writable();

export const size = writable();
export const leverage = writable();

export const isSubmittingLong = writable(false);
export const isSubmittingShort = writable(false);

export const margin = derived([size, leverage], ([$size, $leverage]) => {
	if (!$size || !$leverage) return 0;
	return ($size || 0) / $leverage;
}, 0);

export const marginPlusFee = derived([size, leverage, product], ([$size, $leverage, $product]) => {
	if (!$size || !$leverage) return 0;
	if (!$product) return 0;
	return $size * $product.fee * 1 / 100 + ($size || 0) / $leverage;
}, 0);

// Pools
export const pools = writable({});
export const capPool = writable({});

// Positions
export const positions = writable([]);

// Prices
export const prices = writable({});

// Router
export const component = writable();
export const currentPage = writable();

// Toast
export const toast = writable(null);

// Modal
export const activeModal = writable({});

// Chart
export const chartResolution = writable(900);

// Wallet
export const provider = writable(null);
export const chainId = writable(null);
export const signer = writable(null);
export const address = writable(null);

export const allowances = writable({});

export const wrongNetwork = writable(false);