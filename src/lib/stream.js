// Websocket (price)

import { get } from 'svelte/store'

import { prices, prices24h, productId, activeProducts } from './stores'

import { onNewPrice } from './chart'

import { setTitle, shortSymbol, showToast, hideToast } from './utils'

let ws;
let h;
let subscribedProducts = {
	'ETH-USD': true
};

function heartbeat() {
	clearTimeout(h);
	h = setTimeout(() => {
		console.log('Terminating, reconnecting socket...');
		if (ws) ws.close(1000,"");
		initWebsocket();
	}, 15 * 1000);
}

setInterval(() => {
	// resubscribe if there is a diff between activeProducts and subscribedProducts
	let _activeProducts = get(activeProducts);
	// console.log('ap', _activeProducts, subscribedProducts);
	let diff = false;
	for (const p in _activeProducts) {
		if (!subscribedProducts[p]) {
			diff = true;
			break;
		}
	}
	for (const p in subscribedProducts) {
		if (!_activeProducts[p]) {
			diff = true;
			break;
		}
	}
	if (diff) {
		subscribedProducts = JSON.parse(JSON.stringify(_activeProducts));
		subscribeToProducts();
	}
}, 1000);

function subscribeToProducts() {

	let _activeProducts = get(activeProducts);

	// console.log('subscribeToProducts', _activeProducts);

	ws.send(JSON.stringify({
	    "type": "unsubscribe",
	    "channels": [
	    	"heartbeat",
	    	"ticker"
	    ]
	}));

	ws.send(JSON.stringify({
	    "type": "subscribe",
	    "product_ids": Object.keys(_activeProducts),
	    "channels": [
	    	"heartbeat",
	    	"ticker"
	    ]
	}));

}

export function initWebsocket() {

	// console.log('initWebsocket');

	let lastMessageReceived = Date.now();

	// Check last ticker
	setInterval(() => {
		if (lastMessageReceived < Date.now() - 60 * 1000) {
			showToast('Price stream is stale. Try refreshing the page.', 'error', 'stream-error');
		} else {
			hideToast('stream-error');
		}
	}, 1000);

	if (ws) {
		try {
			ws.close(3335,"");
		} catch(e) {};
		ws = null;
		clearTimeout(h);
	}

	ws = new WebSocket('wss://ws-feed.exchange.coinbase.com');

	ws.onopen = (e) => {

		//console.log('onopen', ws.readyState, e);

		if (ws.readyState != 1) return;

		heartbeat();

		subscribeToProducts();

	}

	ws.onmessage = (e) => {

		try {

			lastMessageReceived = Date.now();

			const message = JSON.parse(e.data);

			const { type, product_id, open_24h, price } = message;

			if (type == 'heartbeat') return heartbeat();

			if (!product_id || type != 'ticker') return;

			prices.update((x) => {
				x[product_id] = price * 1;
				return x;
			});

			prices24h.update((x) => {
				x[product_id] = open_24h * 1;
				return x;
			});

			// update chart
			onNewPrice(price, Date.now(), product_id);

			if (product_id == get(productId)) {
				setTitle(product_id, price);
			}

		} catch(e) {
			console.error(e);
		}

	}

	ws.onclose = (e) => {

		console.log('Socket closed', e.code, e);

		if (e.wasClean) {

		} else {

		}

		if (e.code != 3335) {
			initWebsocket();
		}

	}

	ws.onerror = (e) => {
		console.log('Websocket error', e);
	}

}