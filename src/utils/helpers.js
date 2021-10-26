// helpers and utility functions
import { ethers } from 'ethers'
import { get } from 'svelte/store'

import { PRODUCTS, CHAINDATA } from './constants'

// Pages
import Home from '../pages/Home.svelte'
import Trade from '../pages/Trade.svelte'
import Pool from '../pages/Pool.svelte'
import Stake from '../pages/Stake.svelte'
import Refer from '../pages/Refer.svelte'

import { hydrateData } from '../lib/data'

import { component, currentPage } from '../stores/router'
import { activeModal } from '../stores/ui'
import { chainId } from '../stores/wallet'

// Price title
export function setTitle(product, price) {
	document.title = `${shortSymbol(product)} ${price} | Cap`;
}

// Text utils
export function shortAddress(address) {
	if (!address) return;
	return address.substring(0,2) + '…' + address.slice(-6);
}
export function shortSymbol(symbol) {
	if (!symbol) return '';
	return symbol.substring(0,symbol.length-4);
}

// Leverage cache
export function getCachedLeverage(_productId) {
	let cl = localStorage.getItem('leverage');
	if (cl) {
		try {
			cl = JSON.parse(cl);
			return cl[_productId] * 1;
		} catch(e) {}
	} else {
		return null;
	}
}

export function setCachedLeverage(_productId, _leverage) {
	let cl = localStorage.getItem('leverage');
	if (cl) {
		cl = JSON.parse(cl);
		cl[_productId] = _leverage * 1;
		localStorage.setItem('leverage', JSON.stringify(cl));
	} else {
		localStorage.setItem('leverage', JSON.stringify({[_productId]: _leverage}));
	}
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
	console.log('loadRoute', path);
	if (!path || path == '/') {
		component.set(Home);
		currentPage.set('home');
	} else if (path.includes('/trade')) {
		component.set(Trade);
		currentPage.set('trade');
	} else if (path.includes('/pool')) {
		component.set(Pool);
		currentPage.set('pool');
	} else if (path.includes('/stake')) {
		component.set(Stake);
		currentPage.set('stake');
	}
	hydrateData();
}
export function navigateTo(path) {
    window.history.pushState(null, null, path);
    loadRoute(path);
}

// Data formatters
export function formatUnits(number, units) {
  return ethers.utils.formatUnits(number || 0, units || 8);
}
export function parseUnits(number, units) {
  if (typeof(number) == 'number') {
  	number = "" + number;
  }
  return ethers.utils.parseUnits(number, units || 8);
}
export function formatProduct(id, product) {
	return {
		productId: id,
		symbol: PRODUCTS[id].symbol,
		maxLeverage: product.maxLeverage,
		liquidationThreshold: formatUnits(product.liquidationThreshold, 2),
		fee: formatUnits(product.fee, 4),
		interest: formatUnits(product.fee, 2)
	};
}
export function formatPositions(positions) {
	let formattedPositions = [];
	let i = 0;
	for (const p of positions) {
		if (!p.productId) {
			i++;
			continue;
		}
		formattedPositions.push({
			positionId: p.positionId,
			product: PRODUCTS[p.productId].symbol,
			timestamp: p.timestamp,
			isLong: p.isLong,
			margin: formatUnits(p.margin),
			leverage: formatUnits(p.leverage),
			amount: formatUnits(p.margin) * formatUnits(p.leverage),
			price: formatUnits(p.price),
			productId: p.productId,
			closeOrderId: p.closeOrderId,
			currency: p.currency,
			fee: formatUnits(p.fee.toNumber())
		});
		i++;
	}
	formattedPositions.reverse();
	return formattedPositions;
}
export function formatTrades(trades) {
	if (!trades) return [];
	let formattedTrades = [];
	for (const t of trades) {
		formattedTrades.push({
			positionId: t.positionId,
			orderId: t.orderId,
			productId: t.productId,
			product: PRODUCTS(t.productId).symbol,
			price: formatUnits(t.closePrice || t.price),
			entryPrice: formatUnits(t.entryPrice),
			margin: formatUnits(t.margin),
			leverage: formatUnits(t.leverage),
			amount: formatUnits(t.margin) * formatUnits(t.leverage),
			timestamp: t.timestamp,
			isLong: t.isLong,
			pnl: formatUnits(t.pnl),
			pnlIsNegative: t.pnlIsNegative,
			isFullClose: t.isFullClose,
			wasLiquidated: t.wasLiquidated,
			txHash: t.txHash,
			block: t.blockNumber
		});
	}
	return formattedTrades;
}

// Access utils
export function getChainData(label) {
	const _chainId = get(chainId);
	if (!_chainId || !CHAINDATA[_chainId]) return;
	return CHAINDATA[_chainId][label];
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