import { writable, derived } from 'svelte/store'

// History
export const history = writable([]);

// New order
export const productId = writable(localStorage.getItem('productId') || 'ETH-USD');
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
	let fee = $product.fee || 0;
	return $size * fee * 1 / 100 + ($size || 0) / $leverage;
}, 0);

// Pools
export const pools = writable({});
export const capPool = writable({});

// Orders
export const orders = writable([]);

// Positions
export const positions = writable([]);

export const enhancedPositions = derived([orders, positions], ([$orders, $positions]) => {
	// console.log('orders', $orders);
	// console.log('positions', $positions);
	let enhanced_positions = [];
	let new_orders = [];
	let used_orders = {};
	for (let p of $positions) {
		for (let o of $orders) {
			if (o.key == p.key) {
				if (o.isClose) {
					p.isClosing = true;
				} else {
					p.isSettling = true;
				}
				used_orders[o.key] = true;
			}
		}
		enhanced_positions.push(p);
	}
	for (let o of $orders) {
		if (!used_orders[o.key]) {
			o.isSettling = true;
			new_orders.push(o);
		}
	}
	enhanced_positions.sort((a,b) => {
		if (a.timestamp > b.timestamp) return -1;
		if (a.timestamp < b.timestamp) return 1;
		return 0;
	});
	new_orders.reverse();
	return new_orders.concat(enhanced_positions);
}, []);

// Prices
export const prices = writable({});
export const prices24h = writable({});

// Router
export const component = writable();
export const currentPage = writable();

// Toast
export const toast = writable(null);

// Modal
export const activeModal = writable({});

// Chart
export const chartResolution = writable(localStorage.getItem('chartResolution') || 900);
export const chartLoading = writable();

// Wallet
export const provider = writable(null);
export const chainId = writable(null);
export const signer = writable(null);
export const address = writable(null);

export const allowances = writable({});

export const wrongNetwork = writable(false);