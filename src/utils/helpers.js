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

import { getProduct } from '../lib/methods'

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
export function txLink(hash) {
	const explorer = getChainData('explorer');
	return `${explorer}/tx/${hash}`; 
}
export function addrLink(addr) {
	const explorer = getChainData('explorer');
	return `${explorer}/address/${addr}`; 
}
export function formatToDisplay(amount, maxPrecision, fixPrecision) {
	if (amount == undefined || isNaN(amount)) return '';
	if (!maxPrecision) maxPrecision = 100;

	if (!fixPrecision && (amount*1 == 0 || amount * 1 >= 1) && (amount * 1).toFixed(3)*1 == Math.round(amount * 1)) return Math.round(amount).toLocaleString();
	
	if (amount * 1 >= 1000 || amount * 1 <= -1000) {
		return Math.round(amount*1).toLocaleString();
	} else if (amount * 1 >= 100 || amount * 1 <= -100) {
		return (amount * 1).toFixed(2);
	} else if (amount * 1 >= 1 || amount * 1 <= -1) {
		return (amount * 1).toFixed(Math.min(maxPrecision,3));
	} else if (amount * 1 >= 0.1 || amount * 1 <= -0.1) {
		return (amount * 1).toFixed(Math.min(maxPrecision,5));
	} else {
		return (amount * 1).toFixed(Math.min(maxPrecision,6));
	}
}
export function displayPricePercentChange(last, initial) {
	if (!last || !initial) return '';
	const diff = (last * 1 - initial * 1) / initial;
	let string = '';
	if (diff >= 0) {
		string += '+';
	}
	string += formatToDisplay(diff*100, 2, true) + "%" || '';
	return string;
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

// Liq price
export function calculateLiquidationPrice(params) {
	const { productId, price, leverage, isLong } = params;
	let liquidationPrice;
	if (isLong) {
		liquidationPrice = price * (1 - 8000 / 10000 / leverage);
	} else {
		liquidationPrice = price * (1 + 8000 / 10000 / leverage);
	}
	return liquidationPrice;
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
			currencyLabel: getCurrencyLabelFromAddress(p.currency),
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
			currency: t.currency,
			currencyLabel: getCurrencyLabelFromAddress(t.currency),
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
export function formatPnl(pnl, pnlIsNegative, isPercent) {
	let string = '';
	if (pnl == undefined) return string;
	if (pnlIsNegative == undefined) {
		pnlIsNegative = pnl < 0;
	}
	if (!pnlIsNegative) {
		string += '+';
	} else if (pnl > 0) {
		string += '-';
	}
	string += formatToDisplay(pnl, isPercent ? 2 : null) || 0;
	return string;
}

// Access utils
export function getChainData(label) {
	const _chainId = get(chainId);
	if (!_chainId || !CHAINDATA[_chainId]) return;
	return CHAINDATA[_chainId][label];
}
export function getCurrencyLabelFromAddress(_address) {
	const _chainId = get(chainId);
	if (!_chainId || !CHAINDATA[_chainId]) return;
	const currencies = getChainData('currencies');
	for (const _currencyLabel in currencies) {
		if (currencies[_currencyLabel].toLowerCase() == _address.toLowerCase()) {
			return _currencyLabel;
		}
	}
}

// UPL
export async function getUPL(position, latestPrice) {
	let upl = 0;
	if (position.price * 1 == 0) return undefined;
	if (latestPrice) {
		const productInfo = await getProduct(position.productId);
		if (position.isLong) {
			upl = position.margin * position.leverage * (latestPrice * 1 - position.price * 1) / position.price;
		} else {
			upl = position.margin * position.leverage * (position.price * 1 - latestPrice * 1) / position.price;
		}
		// Add interest
		let interest;
		let now = parseInt(Date.now() / 1000);
		if (position.isSettling || now < position.timestamp * 1 + 1800) {
			interest = 0;
		} else {
			interest = position.margin * position.leverage * ((productInfo.interest * 1 || 0) / 100) * (now - position.timestamp * 1) / (360 * 24 * 3600);
		}
		if (interest < 0) interest = 0;
		upl -= interest;
	}
	return upl;
}

export async function getInterest(position) {
		// Add interest
		let interest;
		let now = parseInt(Date.now() / 1000);
		const productInfo = await getProduct(position.productId);
		if (position.isSettling || now < position.timestamp * 1 + 1800) {
			interest = 0;
		} else {
			interest = position.margin * position.leverage * ((productInfo.interest * 1 || 0) / 100) * (now - position.timestamp * 1) / (360 * 24 * 3600);
		}
		if (interest < 0) interest = 0;
		return -1 * interest;
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