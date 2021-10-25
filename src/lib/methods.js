// Contract interaction
import { get } from 'svelte/store'

import { monitorTx } from './monitor'

import { getContract } from './contracts'
import { ADDRESS_ZERO } from '../utils/constants'
import { formatProduct, getChainData, parseUnits, formatUnits, formatPositions } from '../utils/helpers'

import { productId, product, currencyLabel, currency, amount, leverage } from '../stores/order'
import { userPositionIds } from '../stores/positions'
import { address, allowances } from '../stores/wallet'

export async function selectProduct(_productId) {
	if (!_productId) _productId = get(productId);
	const contract = await getContract('trading');
	console.log('contract', contract);
	if (!contract) return;
	const _product = formatProduct(_productId, await contract.getProduct(_productId));
	console.log('product', _product);
	localStorage.setItem('productId', _productId);
	productId.set(_productId);
	product.set(_product);
	// TODO: set leverage in local storage
}

export async function selectCurrency(_currencyLabel) {
	if (!_currencyLabel) _currencyLabel = get(currencyLabel);
	console.log('selectCurrency', _currencyLabel);
	const currencies = getChainData('currencies');
	console.log('c', currencies);
	if (!currencies) return;
	const _currency = currencies[_currencyLabel];
	localStorage.setItem('currencyLabel', _currencyLabel);
	currency.set(_currency);
	console.log('__currency', _currency);
	await getAllowance(_currencyLabel, 'trading');
}

export async function getAllowance(_currencyLabel, spenderName) {
	if (!_currencyLabel) _currencyLabel = get(currencyLabel);
	const _address = get(address);
	console.log('_address', _address);
	if (!_address) return;
	const contract = await getContract(_currencyLabel);
	console.log('cc', contract);
	if (!contract) return;
	const spenderContract = await getContract(spenderName);
	if (!spenderContract) return;
	const allowance = formatUnits(await contract.allowance(_address, spenderContract.address));

	console.log('allowance', allowance);

	allowances.update((x) => {
		if (!x[_currencyLabel]) x[_currencyLabel] = {};
		x[_currencyLabel][spenderName] = allowance;
		return x;
	});

}

export async function getUserPositions() {
	const contract = await getContract('trading');
	if (!contract) return;
	const _address = get(address);
	if (!_address) return;
	positions.set(formatPositions(_userPositionIds, await contract.getUserPositions(_address)));
}

// Setters

export async function approveCurrency(_currencyLabel, spenderName) {
	
	const contract = await getContract(_currencyLabel, true);
	if (!contract) return;

	const spenderContract = await getContract(spenderName);
	if (!spenderContract) return;

	const spenderAddress = spenderContract.address;

	const tx = await contract.approve(spenderAddress, parseUnits(100 * 10**6, 18));

}

export async function submitNewPosition(isLong) {

	const contract = await getContract('trading', true);
	if (!contract) return;

	const _currencyLabel = get(currencyLabel);
	const _currency = get(currency);
	const _productId = get(productId);
	const _amount = get(amount);
	const _leverage = get(leverage);

	if (!_amount || !_leverage) return;

	let margin = _amount / _leverage;

	let tx;

	if (_currencyLabel == 'weth') {

		// Add fee to margin
		const _product = get(product);
		const fee = _product.fee * 1;
		margin += _amount * fee / 100;

		tx = await contract.submitNewPosition(
			_currency,
			_productId,
			0,
			parseUnits(_leverage),
			isLong,
			ADDRESS_ZERO, // referrer
			{value: parseUnits(margin, 18)}
		);
	} else {
		// ERC20, should be pre-approved
		tx = await contract.submitNewPosition(
			_currency,
			_productId,
			parseUnits(margin),
			parseUnits(_leverage),
			isLong,
			ADDRESS_ZERO // referrer
		);
	}

	monitorTx(tx.hash, 'submit-new-position');

}