// Contract interaction
import { get } from 'svelte/store'

import { monitorTx } from './monitor'

import { getContract } from './contracts'
import { loadCandles, loadPositionLines, applyWatermark } from './chart'
import { formatUnits, formatProduct, formatPositions, parseUnits, getChainData, hideModal, showToast } from './utils'


import * as Stores from './stores'

let productCache = {};

export async function getProduct(productId) {
	
	if (productCache[productId]) return productCache[productId];
	
	const contract = await getContract('trading');
	if (!contract) return {};

	productCache[productId] = formatProduct(productId, await contract.getProduct(productId));
	
	return productCache[productId];

}

export async function selectProduct(productId) {
	
	if (!productId) productId = get(Stores.productId);

	const product = await getProduct(productId);

	Stores.product.set(product);
	Stores.productId.set(productId);
	localStorage.setItem('productId', productId);

	// Chart
	loadCandles();
	applyWatermark();

}

export async function selectCurrency(currencyLabel) {
	
	if (!currencyLabel) currencyLabel = get(Stores.currencyLabel);

	const currencies = getChainData('currencies');
	if (!currencies) return;

	const currency = currencies[currencyLabel];

	Stores.currency.set(currency);
	Stores.currencyLabel.set(currencyLabel);
	localStorage.setItem('currencyLabel', currencyLabel);

	await getAllowance(currencyLabel, 'trading');

}

export async function getAllowance(currencyLabel, spenderName) {
	
	if (!currencyLabel) currencyLabel = get(Stores.currencyLabel);

	if (currencyLabel == 'weth') {
		Stores.allowances.update((x) => {
			if (!x[currencyLabel]) x[currencyLabel] = {};
			x[currencyLabel][spenderName] = parseUnits(10**10, 18);
			return x;
		});
		return;
	}

	const address = get(Stores.address);
	if (!address) return;

	const contract = await getContract(currencyLabel);
	if (!contract) return;

	const spenderContract = await getContract(spenderName);
	if (!spenderContract) return;

	const allowance = formatUnits(await contract.allowance(address, spenderContract.address));

	Stores.allowances.update((x) => {
		if (!x[currencyLabel]) x[currencyLabel] = {};
		x[currencyLabel][spenderName] = allowance;
		return x;
	});

}

// ERC20

export async function approveCurrency(currencyLabel, spenderName) {
	
	const contract = await getContract(currencyLabel, true);
	if (!contract) return;

	const spenderContract = await getContract(spenderName);
	if (!spenderContract) return;

	const spenderAddress = spenderContract.address;

	const tx = await contract.approve(spenderAddress, parseUnits(10 * 10**9, 18));

	monitorTx(tx.hash, 'approve', {currencyLabel, spenderName});

}

export async function getBalanceOf(currencyLabel, address, forceWETH) {
	
	if (!currencyLabel) currencyLabel = get(Stores.currencyLabel);
	
	if (!address) {
		address = get(Stores.address);
		if (!address) return;
	}

	let balance;
	if (currencyLabel == 'weth' && !forceWETH) {
		// get ETH balance
		balance = await get(Stores.provider).getBalance(address);
	} else {
		const contract = await getContract(currencyLabel);
		if (!contract) return;
		balance = await contract.balanceOf(address);
	}
	
	return formatUnits(balance);

}

// Pool

export async function getUserPoolBalance(currencyLabel) {
	
	const address = get(Stores.address);
	if (!address) return 0;

	const contract = await getContract('pool', false, currencyLabel);
	if (!contract) return 0;

	return formatUnits(await contract.getCurrencyBalance(address));

}

export async function getPoolInfo(currencyLabel) {

	const contract = await getContract('pool', false, currencyLabel);
	if (!contract) return {};

	let info = {};

	try {
		const poolBalance = await getBalanceOf(currencyLabel, contract.address, true);
		const userBalance = await getUserPoolBalance(currencyLabel);
		const claimableReward = await getClaimableReward(currencyLabel);

		info = {
			tvl: poolBalance,
			userBalance,
			claimableReward
		};
	} catch(e) {}

	Stores.pools.update((x) => {
		x[currencyLabel] = info;
		return x;
	});

}

export async function deposit(currencyLabel, amount) {
	
	const contract = await getContract('pool', true, currencyLabel);
	if (!contract) return;

	let tx;

	if (currencyLabel == 'weth') {
		tx = await contract.deposit(amount, {value: parseUnits(amount)});
	} else {
		tx = await contract.deposit(parseUnits(amount));
	}

	monitorTx(tx.hash, 'pool-deposit', {currencyLabel});

}

export async function withdraw(currencyLabel, amount) {
	
	const contract = await getContract('pool', true, currencyLabel);
	if (!contract) return;

	let tx = await contract.withdraw(parseUnits(amount));

	monitorTx(tx.hash, 'pool-withdraw', {currencyLabel});

}

export async function collectPoolReward(currencyLabel) {
	
	const contract = await getContract('poolrewards', true, currencyLabel);
	if (!contract) return;

	let tx = await contract.collectReward();

	monitorTx(tx.hash, 'pool-collect', {currencyLabel});

}

// Cap Pool

export async function getUserCapBalance() {

	const address = get(Stores.address);
	if (!address) return;

	const contract = await getContract('capPool');
	if (!contract) return;

	return formatUnits(await contract.getBalance(address));

}

export async function getCapSupply() {

	const contract = await getContract('capPool');
	if (!contract) return;
	
	return formatUnits(await contract.totalSupply());

}

export async function getCapPoolInfo() {
	
	const currencies = getChainData('currencies');
	if (!currencies) return;

	let claimableRewards = {};
	for (const currencyLabel in currencies) {
		claimableRewards[currencyLabel] = await getClaimableReward(currencyLabel, true);
	}

	const info = {
		supply: await getCapSupply(),
		userBalance: await getUserCapBalance(),
		claimableRewards
	};

	Stores.capPool.set(info);

}

export async function depositCAP(amount) {
	
	const contract = await getContract('capPool', true);
	if (!contract) return;

	let tx = await contract.stake(parseUnits(amount));

	monitorTx(tx.hash, 'cap-deposit');

}

export async function withdrawCAP(amount) {
	
	const contract = await getContract('capPool', true);
	if (!contract) return;

	let tx = await contract.withdraw(parseUnits(amount));

	monitorTx(tx.hash, 'cap-withdraw');

}

export async function collectCAPReward(currencyLabel) {
	
	const contract = await getContract('caprewards', true, currencyLabel);
	if (!contract) return;

	let tx = await contract.collectReward();

	monitorTx(tx.hash, 'cap-collect', {currencyLabel});

}

// Rewards

export async function getClaimableReward(currencyLabel, forCAP) {
	
	const contractName = forCAP ? 'caprewards' : 'poolrewards';
	const contract = await getContract(contractName, false, currencyLabel);
	if (!contract) return;

	return formatUnits(await contract.getClaimableReward());

}

// Positions

export async function getUserPositions() {

	const contract = await getContract('trading');
	if (!contract) return;
	
	const address = get(Stores.address);
	if (!address) return;
	
	const positions = formatPositions(await contract.getUserPositions(address));

	Stores.positions.set(positions);

	// Chart
	loadPositionLines();

}

// TODO: error handling

export async function submitNewPosition(isLong) {

	const contract = await getContract('trading', true);
	if (!contract) return;

	const currencyLabel = get(Stores.currencyLabel);
	const currency = get(Stores.currency);
	const productId = get(Stores.productId);
	const size = get(Stores.size);
	const leverage = get(Stores.leverage);

	if (!size || !leverage) return;

	let margin = size / leverage;

	if (isLong) {
		Stores.isSubmittingLong.set(true);
	} else {
		Stores.isSubmittingShort.set(true);
	}

	let tx;

	if (currencyLabel == 'weth') {

		// Add fee to margin
		const product = get(Stores.product);
		const fee = product.fee * 1;
		margin += size * fee / 100;

		tx = await contract.submitNewPosition(
			currency,
			productId,
			0,
			parseUnits(size),
			isLong,
			{value: parseUnits(margin)}
		);

	} else {

		// ERC20, should be pre-approved
		tx = await contract.submitNewPosition(
			currency,
			productId,
			parseUnits(margin),
			parseUnits(size),
			isLong
		);

	}

	Stores.isSubmittingLong.set(false);
	Stores.isSubmittingShort.set(false);

	monitorTx(tx.hash, 'submit-new-position');

}

export async function submitCloseOrder(positionId, productId, size, currencyLabel) {

	console.log('sco', positionId, productId, size, currencyLabel);

	const contract = await getContract('trading', true);
	if (!contract) return;

	let tx;

	if (currencyLabel == 'weth') {

		const product = await getProduct(productId);
		const fee = size * product.fee * 1.003 / 100;

		console.log('size', size);
		console.log('fee', product.fee, fee);

		tx = await contract.submitCloseOrder(
			positionId,
			parseUnits(size),
			{value: parseUnits(fee)}
		);

	} else {

		tx = await contract.submitCloseOrder(
			positionId,
			parseUnits(size)
		);

	}

	monitorTx(tx.hash, 'submit-close-order');

}

export async function cancelPosition(positionId) {

	const contract = await getContract('trading', true);
	if (!contract) return;

	try {

		const tx = await contract.cancelPosition(positionId);
		
		monitorTx(tx.hash, 'cancel-position');
		hideModal();

	} catch(e) {
		
		showToast(e);
		return e;

	}

}

export async function addMargin(positionId, margin, productId, currencyLabel) {
	
	const product = await getProduct(productId);

	const contract = await getContract('trading', true);
	if (!contract) return;

	try {

		let tx;

		if (currencyLabel == 'weth') {
			tx = await contract.addMargin(positionId, 0, {value: parseUnits(margin)});
		} else {
			tx = await contract.addMargin(positionId, parseUnits(margin));
		}
	
		monitorTx(tx.hash, 'add-margin');
		hideModal();
	
	} catch(e) {
	
		showToast(e);
		return e;
	
	}
}

export async function cancelOrder(orderId) {

	const contract = await getContract('trading', true);
	if (!contract) return;

	try {

		const tx = await contract.cancelOrder(orderId);
		monitorTx(tx.hash, 'cancel-order');
		hideModal();

	} catch(e) {

		showToast(e);
		return e;

	}

}