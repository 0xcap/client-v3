// Contract interaction
import { get } from 'svelte/store'

import { monitorTx } from './monitor'

import { getContract } from './contracts'
import { loadCandles, loadPositionLines, applyWatermark } from './chart'
import { formatUnits, formatProduct, formatPositions, parseUnits, getChainData, hideModal, showToast, getCachedLeverage } from './utils'

import * as Stores from './stores'

let productCache = {};

// TODO: errors and toasts

export async function getProduct(productId) {
	
	if (productCache[productId]) return productCache[productId];
	
	const contract = await getContract('trading');
	if (!contract) return {};

	productCache[productId] = formatProduct(productId, await contract.getProduct(productId));
	
	return productCache[productId];

}

export async function selectProduct(productId) {
	
	if (!productId) productId = get(Stores.productId);

	let product = await getProduct(productId);

	if (!product.symbol) {
		product = {symbol: 'ETH-USD', productId: 1, maxLeverage: 50};
	}

	Stores.product.set(product);
	Stores.productId.set(productId);
	localStorage.setItem('productId', productId);

	// Leverage
	const cached = getCachedLeverage(productId);
	if (cached) {
		Stores.leverage.set(cached);
	} else {
		Stores.leverage.set(product.maxLeverage);
	}

	// Chart
	await loadCandles();
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

	try {
		const tx = await contract.approve(spenderAddress, parseUnits(10 * 10**9, 18));
		monitorTx(tx.hash, 'approve', {currencyLabel, spenderName});
	} catch(e) {
		showToast(e);
		return e;
	}

}

export async function getBalanceOf(currencyLabel, address, forceWETH) {
	
	if (!currencyLabel) currencyLabel = get(Stores.currencyLabel);
	
	if (!address) {
		address = get(Stores.address);
		if (!address) return 0;
	}

	let balance;
	if (currencyLabel == 'weth' && !forceWETH) {
		// get ETH balance
		balance = await get(Stores.provider).getBalance(address);
	} else {
		const contract = await getContract(currencyLabel);
		if (!contract) return 0;
		balance = await contract.balanceOf(address);
	}
	
	return formatUnits(balance);

}

// Pool

export async function getPoolShare(currencyLabel) {

	const contract = await getContract('treasury');
	if (!contract) return 0;

	const currencies = getChainData('currencies');
	if (!currencies) return;

	const currency = currencies[currencyLabel];

	return formatUnits(await contract.getPoolShare(currency), 2);

}

export async function getCapPoolShare(currencyLabel) {

	const contract = await getContract('treasury');
	if (!contract) return 0;

	const currencies = getChainData('currencies');
	if (!currencies) return;

	const currency = currencies[currencyLabel];

	return formatUnits(await contract.getCapShare(currency), 2);

}

export async function getUserPoolBalance(currencyLabel) {
	
	const address = get(Stores.address);
	if (!address) return 0;

	const contract = await getContract('pool', false, currencyLabel);
	if (!contract) return 0;

	// TEST TEST
	//return 0;

	return formatUnits(await contract.getCurrencyBalance(address));

}

export async function getPoolInfo(currencyLabel) {

	let info = {
		tvl: 0,
		userBalance: 0,
		claimableReward: 0,
		poolShare: 50
	};

	const contract = await getContract('pool', false, currencyLabel);
	if (!contract) {
		Stores.pools.update((x) => {
			x[currencyLabel] = info;
			return x;
		});
		return;
	}

	try {
		const poolBalance = await getBalanceOf(currencyLabel, contract.address, true);
		const userBalance = await getUserPoolBalance(currencyLabel);
		const claimableReward = await getClaimableReward(currencyLabel);
		const poolShare = await getPoolShare(currencyLabel);

		info = {
			tvl: poolBalance,
			userBalance,
			claimableReward,
			poolShare
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

	try {
		let tx;

		if (currencyLabel == 'weth') {
			tx = await contract.deposit(0, {value: parseUnits(amount)});
		} else {
			tx = await contract.deposit(parseUnits(amount));
		}

		monitorTx(tx.hash, 'pool-deposit', {currencyLabel});
	} catch(e) {
		showToast(e);
		return e;
	}

}

export async function withdraw(currencyLabel, amount) {
	
	const contract = await getContract('pool', true, currencyLabel);
	if (!contract) return;

	try {
		let tx = await contract.withdraw(parseUnits(amount));
		monitorTx(tx.hash, 'pool-withdraw', {currencyLabel});
	} catch(e) {
		showToast(e);
		return e;
	}

}

export async function collectPoolReward(currencyLabel) {
	
	const contract = await getContract('poolrewards', true, currencyLabel);
	if (!contract) return;

	try {
		let tx = await contract.collectReward();
		monitorTx(tx.hash, 'pool-collect', {currencyLabel});
	} catch(e) {
		showToast(e);
		return e;
	}

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
	
	let info = {
		supply: 0,
		userBalance: 0,
		claimableRewards: {},
		poolShares: {}
	};

	const currencies = getChainData('currencies');
	if (!currencies || !get(Stores.address)) {
		Stores.capPool.set(info);
		return;
	}

	let claimableRewards = {};
	let poolShares = {};
	for (const currencyLabel in currencies) {
		claimableRewards[currencyLabel] = await getClaimableReward(currencyLabel, true);
		poolShares[currencyLabel] = await getCapPoolShare(currencyLabel);
	}

	info = {
		supply: await getCapSupply(),
		userBalance: await getUserCapBalance(),
		claimableRewards,
		poolShares
	};

	Stores.capPool.set(info);

}

export async function depositCAP(amount) {
	
	const contract = await getContract('capPool', true);
	if (!contract) return;

	try {
		let tx = await contract.deposit(parseUnits(amount));
		monitorTx(tx.hash, 'cap-deposit');
	} catch(e) {
		showToast(e);
		return e;
	}

}

export async function withdrawCAP(amount) {
	
	const contract = await getContract('capPool', true);
	if (!contract) return;

	try {
		let tx = await contract.withdraw(parseUnits(amount));
		monitorTx(tx.hash, 'cap-withdraw');
	} catch(e) {
		showToast(e);
		return e;
	}

}

export async function collectCAPReward(currencyLabel) {
	
	const contract = await getContract('caprewards', true, currencyLabel);
	if (!contract) return;

	try {
		let tx = await contract.collectReward();
		monitorTx(tx.hash, 'cap-collect', {currencyLabel});
	} catch(e) {
		showToast(e);
		return e;
	}

}

// Rewards

export async function getClaimableReward(currencyLabel, forCAP) {
	
	const contractName = forCAP ? 'caprewards' : 'poolrewards';
	const contract = await getContract(contractName, true, currencyLabel);
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

	try {

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

		monitorTx(tx.hash, 'submit-new-position');

	} catch(e) {
		showToast(e);
		return e;
	}

}

export async function submitCloseOrder(positionId, productId, size, currencyLabel) {

	//console.log('sco', positionId, productId, size, currencyLabel);

	const contract = await getContract('trading', true);
	if (!contract) return;

	try {
		let tx;

		if (currencyLabel == 'weth') {

			const product = await getProduct(productId);
			const fee = size * product.fee * 1.003 / 100;

			// console.log('size', size);
			// console.log('fee', product.fee, fee);

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

	} catch(e) {
		showToast(e);
		return e;
	}

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