// Contract interaction
import { get } from 'svelte/store'

import { monitorTx } from './monitor'

import { getContract } from './contracts'
import { loadCandles, loadPositionLines } from './chart'
import { ADDRESS_ZERO } from '../utils/constants'
import { formatProduct, getChainData, parseUnits, formatUnits, formatPositions } from '../utils/helpers'

import { productId, product, currencyLabel, currency, amount, leverage } from '../stores/order'
import { pools } from '../stores/pools'
import { positions } from '../stores/positions'
import { staking } from '../stores/staking'
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

	loadCandles(); // chart
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

export async function getBalanceOf(_currencyLabel, _address) {
	if (!_currencyLabel) _currencyLabel = get(currencyLabel);
	const contract = await getContract(_currencyLabel);
	if (!contract) return;
	return formatUnits(await contract.balanceOf(_address), 18);
}

// Pool

export async function getPoolStakedBalance(_currencyLabel) {
	const _address = get(address);
	if (!_address) return;
	const contract = await getContract('pool', false, _currencyLabel);
	if (!contract) return;
	return formatUnits(await contract.getStakedBalance(_address), 18);
}

export async function getPoolClpSupply(_currencyLabel) {
	const contract = await getContract('pool', false, _currencyLabel);
	if (!contract) return;
	return formatUnits(await contract.clpSupply(), 18);
}

export async function getPoolInfo(_currencyLabel) {
	// combination of above, set in store
	const contract = await getContract('pool', false, _currencyLabel);
	if (!contract) return;

	const info = {
		tvl: await getBalanceOf(_currencyLabel, contract.address),
		clpSupply: await getPoolClpSupply(_currencyLabel),
		stakedBalance: await getPoolStakedBalance(_currencyLabel),
		claimableReward: await getClaimableReward(_currencyLabel)
	};

	pools.update((x) => {
		x[_currencyLabel] = info;
		return x;
	});

}

// Staking

export async function getCapStakedBalance() {
	const _address = get(address);
	if (!_address) return;
	const contract = await getContract('capStaking');
	if (!contract) return;
	return formatUnits(await contract.getStakedBalance(_address), 18);
}

export async function getCapStakedSupply() {
	const contract = await getContract('capStaking');
	console.log('CAP staking address', contract.address);
	if (!contract) return;
	return formatUnits(await contract.totalSupply(), 18);
}

export async function getStakingInfo() {
	// combination of above, set in store

	console.log('getStakingInfo');
	
	const currencies = getChainData('currencies');
	console.log('c', currencies);
	if (!currencies) return;

	let claimableRewards = {};
	for (const _currencyLabel in currencies) {
		claimableRewards[_currencyLabel] = await getClaimableReward(_currencyLabel, true);
	}
	const info = {
		stakedSupply: await getCapStakedSupply(),
		stakedBalance: await getCapStakedBalance(),
		claimableRewards
	};

	staking.set(info);

}

// Rewards

export async function getClaimableReward(_currencyLabel, forCAP) {
	let contractName;
	if (forCAP) {
		contractName = 'caprewards';
	} else {
		contractName = 'poolrewards';
	}
	const contract = await getContract(contractName, false, _currencyLabel);
	if (!contract) return;
	return formatUnits(await contract.getClaimableReward(), 18);
}

// Positions


export async function getUserPositions() {
	console.log('getUserPositions');
	const contract = await getContract('trading');
	if (!contract) return;
	const _address = get(address);
	if (!_address) return;
	const _positions = formatPositions(await contract.getUserPositions(_address));
	console.log('p', _positions);
	positions.set(_positions);

	loadPositionLines();
}

// Setters

export async function approveCurrency(_currencyLabel, spenderName) {
	
	const contract = await getContract(_currencyLabel, true);
	if (!contract) return;

	const spenderContract = await getContract(spenderName);
	if (!spenderContract) return;

	const spenderAddress = spenderContract.address;

	const tx = await contract.approve(spenderAddress, parseUnits(10 * 10**9, 18));

	monitorTx(tx.hash, 'approve', {currencyLabel: _currencyLabel, spenderName});

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

// pool 

export async function stakeInPool(_currencyLabel, amount) {
	
	const contract = await getContract('pool', true, _currencyLabel);
	if (!contract) return;

	console.log('stakeInPool', _currencyLabel, amount, contract.address);
	let tx;

	if (_currencyLabel == 'weth') {
		tx = await contract.mintAndStakeCLP(amount, {value: parseUnits(amount, 18)});
	} else {
		tx = await contract.mintAndStakeCLP(parseUnits(amount, 18));

	}

	monitorTx(tx.hash, 'pool-stake', {currencyLabel: _currencyLabel});

}

export async function unstakeFromPool(_currencyLabel, amount) {
	
	const contract = await getContract('pool', true, _currencyLabel);
	if (!contract) return;

	let tx = await contract.unstakeAndBurnCLP(parseUnits(amount, 18));

	monitorTx(tx.hash, 'pool-unstake', {currencyLabel: _currencyLabel});

}

export async function collectPoolReward(_currencyLabel) {
	
	const contract = await getContract('poolrewards', true, _currencyLabel);
	if (!contract) return;

	let tx = await contract.collectReward();

	monitorTx(tx.hash, 'pool-collect', {currencyLabel: _currencyLabel});

}

// staking 

export async function stakeCAP(amount) {
	
	const contract = await getContract('capStaking', true);
	if (!contract) return;

	let tx = await contract.stake(parseUnits(amount, 18));

	monitorTx(tx.hash, 'cap-stake');

}

export async function unstakeCAP(amount) {
	
	const contract = await getContract('capStaking', true);
	if (!contract) return;

	let tx = await contract.unstake(parseUnits(amount, 18));

	monitorTx(tx.hash, 'cap-unstake');

}

export async function collectCAPReward(_currencyLabel) {
	
	const contract = await getContract('caprewards', true, _currencyLabel);
	if (!contract) return;

	let tx = await contract.collectReward();

	monitorTx(tx.hash, 'cap-collect', {currencyLabel: _currencyLabel});

}