// helpers and utility functions

import { PRODUCTS } from './constants'

// Pages
import Home from '../pages/Home.svelte'
import Trade from '../pages/Trade.svelte'
import Pool from '../pages/Pool.svelte'
import Stake from '../pages/Stake.svelte'
import Refer from '../pages/Refer.svelte'

import { component, currentPage } from '../stores/router'
import { activeModal } from '../stores/ui'

// Text utils
export function shortAddress(address) {
	if (!address) return;
	return address.substring(0,2) + '…' + address.slice(-6);
}

// Toasts
export function showToast(data, type) {
	console.log('toast', data, type);
}
export function hideToast() {
	console.log('hideToast');
}

// Modals
export function showModal(name, data) {
	activeModal.set({name, data});
}
export function hideModal() {
	activeModal.set({});
}

// Routing
export function loadRoute(path) {
	if (!path || path == '/') {
		component.set(Home);
		currentPage.set('home');
	} else if (path.includes('/trade')) {
		component.set(Trade);
		currentPage.set('trade');
	}
}
export function navigateTo(path) {
    window.history.pushState(null, null, path);
    loadRoute(path);
}

// Data formatters
export function formatProduct(id, product) {
	return {
		id: id,
		symbol: PRODUCTS[id].symbol,
		maxLeverage: product.maxLeverage,
		liquidationThreshold: formatUnits(product.liquidationThreshold, 2),
		fee: formatUnits(product.fee, 4),
		interest: formatUnits(product.fee, 2)
	};
}

// UI
export function hidePopoversOnClick() {

	window.addEventListener('click', (ev) => {

		if (ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.defaultPrevented) {
		  return true;
		}
      
		if (ev.target && ev.target.getAttribute('data-intercept')) return true;

		let interceptor = null;
		for (let n = ev.target; n.parentNode; n = n.parentNode) {
			if (n.getAttribute('data-intercept')) {
			  interceptor = true;
			  break;
			}
		}

		if (interceptor) return true;

		hideModal();

	});

	window.addEventListener('keydown', (ev) => {
		if (ev.key == 'Escape') {
			hideModal();
			hideToast();
		}
	});

}
export function catchLinks(cb) {

	window.addEventListener('click', (ev) => {

		if (ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.defaultPrevented) {
			return true;
		}
		
		let anchor = null;
		for (let n = ev.target; n.parentNode; n = n.parentNode) {
			if (n.nodeName === 'A') {
				anchor = n;
				break;
			}
		}

		if (!anchor) return true;
		
		let href = anchor.getAttribute('href');
		
		if (!href || href && href.includes('http')) return true;
		
		ev.preventDefault();
		
		cb(href);

		return false;

	});

}