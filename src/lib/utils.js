// helpers and utility functions
import { ethers } from 'ethers'
import { get } from 'svelte/store'

import { CHAINDATA } from './constants'
import { PRODUCTS } from './products'

// Pages
import Home from '../components/pages/Home.svelte'
import Trade from '../components/pages/Trade.svelte'
import Pool from '../components/pages/Pool.svelte'
import Buy from '../components/pages/Buy.svelte'

import { hydrateData } from './data'
import { getProduct } from './methods'
import { parseErrorToString } from './errors'

import { component, currentPage, activeModal, toast, chainId, activeProducts, productId, positions } from './stores'

// Price title
export function setTitle(product, price) {
	if (get(currentPage) == 'trade') {
		document.title = `${product} ${price} | CAP`;
	}
}

// Text utils
export function shortAddress(address) {
	if (!address) return;
	return address.substring(0,2) + '…' + address.slice(-4);
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
export function formatCurrency(_currencyLabel) {
	if (!_currencyLabel) return 'ETH';
	if (_currencyLabel.toLowerCase() == 'weth') return 'ETH';
	if (_currencyLabel.toLowerCase() == 'usdc') return 'USDC';
	if (_currencyLabel.toLowerCase() == 'cap') return 'CAP';
	return _currencyLabel;
}
export function formatToDisplay(amount, maxPrecision, fixPrecision) {
	if (amount == undefined || isNaN(amount)) return '';
	if (!maxPrecision) maxPrecision = 100;

	if (!fixPrecision && amount * 1 <= 100 && (amount * 1).toFixed(6)*1 == Math.round(amount * 1)) return Math.round(amount);
	
	if (amount * 1 >= 100000 || amount * 1 <= -100000) {
		return Math.round(amount*1).toLocaleString();
	} else if (amount * 1 >= 10 || amount * 1 <= -10) {
		return (amount * 1).toFixed(2);
	} else if (amount * 1 >= 1 || amount * 1 <= -1) {
		return +(amount * 1).toFixed(Math.min(maxPrecision,2));
	} else if (amount * 1 >= 0.1 || amount * 1 <= -0.1) {
		return +(amount * 1).toFixed(Math.min(maxPrecision,4));
	} else {
		return +(amount * 1).toFixed(Math.min(maxPrecision,6));
	}
}
export function displayPricePercentChange(last, initial) {
	if (!last || !initial) return '';
	const diff = (last * 1 - initial * 1) / initial;
	let string = '';
	if (diff >= 0) {
		string += '+';
	}
	string += formatToDisplay(diff*100, 2, true) || '';
	return string;
}

// Active products
export function setActiveProducts() {
	// Products that aren't in positions or selected
	const _productId = get(productId);
	const _positions = get(positions);
	let positionProducts = {};
	for (const p of _positions) {
		positionProducts[p.productId] = true;
	}
	activeProducts.update((x) => {
		for (const p in PRODUCTS) {
			if (!positionProducts[p] && p != _productId && p != 'ETH-USD') {
				delete x[p];
			} else {
				x[p] = true;
			}
		}
		return x;
	});
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
let timer;
export function showToast(data, type, id) {
	let message = parseErrorToString(data);
	if (!type) type = 'error';
	if (!message) return;
	toast.set({message, type, id});
	if (type == 'error') {
		amplitude.getInstance().logEvent('Error', {message});
	}
	clearTimeout(timer);
	timer = setTimeout(() => {hideToast()}, 7*1000);
}
export function hideToast(id) {
	const _toast = get(toast);
	if (!id || id && _toast && _toast.id == id) {
		clearTimeout(timer);
		toast.set(null);
	}
}

// Modals
export function showModal(name, data) {
	activeModal.set({name, data});
}
export function hideModal() {
	activeModal.set({});
}

// Routing
export function loadRoute(path, isInitial) {
	if (!path || path == '/' || path.includes('/home')) {
		component.set(Home);
		currentPage.set('home');
		document.title = `Free Decentralized Perpetual Exchange | CAP`;
	} else if (path.includes('/trade')) {
		component.set(Trade);
		currentPage.set('trade');
		document.title = `Trade | CAP`;
	} else if (path.includes('/pool')) {
		component.set(Pool);
		currentPage.set('pool');
		document.title = `Pool | CAP`;
	} else if (path.includes('/buy')) {
		component.set(Buy);
		currentPage.set('buy');
		document.title = `Buy CAP | CAP`;
	}
	hydrateData();
}
export function navigateTo(path) {
    window.history.pushState(null, null, path);
    loadRoute(path, false);
}

export function toBytes32(string) {
  return ethers.utils.formatBytes32String(string);
}
export function fromBytes32(string) {
  return ethers.utils.parseBytes32String(string);
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
		symbol: id,
		logo: PRODUCTS[id].logo,
		hours: PRODUCTS[id].hours,
		maxLeverage: formatUnits(product.maxLeverage),
		liquidationThreshold: formatUnits(product.liquidationThreshold, 2),
		fee: formatUnits(product.fee, 4),
		interest: formatUnits(product.interest, 10)
	};
}
export function formatOrders(orders, info) {
	let formattedOrders = [];
	//console.log('order_info', info);
	let i = 0;
	for (const o of orders) {
		if (!o.size.toNumber()) {
			i++;
			continue;
		}
		//console.log('o', o);
		formattedOrders.push({
			key: info[i].key || info[i].id,
			price: 0,
			isClose: o.isClose,
			margin: formatUnits(o.margin),
			size: formatUnits(o.size),
			currency: info[i].currency,
			isLong: info[i].isLong,
			currencyLabel: getCurrencyLabelFromAddress(info[i].currency),
			productId: fromBytes32(info[i].productId),
			product: fromBytes32(info[i].productId),
			leverage: o.margin.toNumber() ? formatUnits(o.size) * 1 / (formatUnits(o.margin) * 1) : 0,
		});
		i++;
	}
	// console.log('formattedOrders', formattedOrders);
	return formattedOrders;
}
export function formatPositions(positions, info) {
	let formattedPositions = [];
	// console.log('position info', info);
	// console.log('positions', positions);
	let i = 0;
	if (!info) info = {};
	for (const p of positions) {
		if (!p.size || !p.size*1 || p.size.toString()*1 == 0) {
			i++;
			continue;
		}
		// console.log('psize', p.size.toString(), p.size.toString()*1);
		// console.log('p', p);
		formattedPositions.push({
			key: p.id || info[i] && info[i].key,
			margin: formatUnits(p.margin),
			size: formatUnits(p.size),
			price: formatUnits(p.price),
			timestamp: p.createdAtTimestamp || p.timestamp.toString(),
			currency: p.currency || info[i] && info[i].currency,
			isLong: p.isLong === undefined ? info[i] && info[i].isLong : p.isLong,
			currencyLabel: getCurrencyLabelFromAddress(p.currency || info[i] && info[i].currency),
			productId: fromBytes32(p.productId || info[i] && info[i].productId),
			product: fromBytes32(p.productId || info[i] && info[i].productId),
			leverage: formatUnits(p.size) / formatUnits(p.margin),
			fee: formatUnits(p.fee || info[i] && info[i].fee)
		});
		i++;
	}
	// console.log('formattedPositions', formattedPositions);
	return formattedPositions;
}
export function formatTrades(trades) {
	if (!trades) return [];
	let formattedTrades = [];
	for (const t of trades) {
		//console.log('t', t);
		formattedTrades.push({
			positionKey: t.positionKey,
			currency: t.currency,
			currencyLabel: getCurrencyLabelFromAddress(t.currency),
			productId: fromBytes32(t.productId),
			product: fromBytes32(t.productId),
			price: formatUnits(t.closePrice || t.price),
			entryPrice: formatUnits(t.entryPrice),
			margin: formatUnits(t.margin),
			size: formatUnits(t.size),
			leverage: formatUnits(t.size) * 1 / (formatUnits(t.margin) * 1),
			timestamp: t.timestamp,
			isLong: t.isLong,
			pnl: formatUnits(t.pnl),
			isFullClose: t.isFullClose,
			wasLiquidated: t.wasLiquidated,
			txHash: t.txHash,
			block: t.blockNumber
		});
	}
	return formattedTrades;
}
export function formatPnl(pnl, isPercent) {
	let string = '';
	if (pnl == undefined) return string;
	let pnlIsNegative = pnl < 0;
	if (!pnlIsNegative) {
		string += '+';
	} else if (pnl > 0) {
		string += '-';
	}
	// console.log('pnl', pnl);
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
	if (!_address) return;
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

	let priceImpact = getPriceImpact(position.size, position.productId, position.currencyLabel);
	if (latestPrice) {
		const productInfo = await getProduct(position.productId);
		if (position.isLong) {
			latestPrice = latestPrice * (1 + priceImpact / 100);
			upl = position.size * (latestPrice * 1 - position.price * 1) / position.price;
		} else {
			latestPrice = latestPrice * (1 - priceImpact / 100);
			upl = position.size * (position.price * 1 - latestPrice * 1) / position.price;
		}
		// Add interest
		let interest = await getInterest(position);
		upl -= interest;
	}
	return upl;
}

export async function getInterest(position) {
		// Add interest
		let interest;
		let now = parseInt(Date.now() / 1000);
		const productInfo = await getProduct(position.productId);
		if (!position.price || !position.timestamp || now < position.timestamp * 1 + 900) {
			interest = 0;
		} else {
			interest = position.size * ((productInfo.interest * 1 || 0) / 100) * (now - position.timestamp * 1) / (360 * 24 * 3600);
		}
		if (interest < 0) interest = 0;
		return -1 * interest;
}

export function getPriceImpact(size, _productId, _currencyLabel) {
	if (!size || !_productId || !_currencyLabel) return 0;
	
	const productParams = PRODUCTS[_productId];
	const {
		baseSpread,
		maxSlippage,
		slippageExponent,
		maxLiquidity
	} = productParams;

	// console.log('l', $size, productParams, $currencyLabel);

	return -1 * (baseSpread * 100 + maxSlippage * (1 - Math.exp(-1 * Math.pow(size / maxLiquidity[_currencyLabel], slippageExponent))));
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
