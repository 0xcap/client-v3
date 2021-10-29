// Connects to contracts deduced from router, initializes with ethers js
import { get } from 'svelte/store'
import { ethers } from 'ethers'
import { CHAINDATA, ABIS } from './constants'
import * as Stores from './stores'

let router;
let contracts = {};

export async function getContract(contractName, withSigner, _currencyLabel) {

	const _signer = get(Stores.signer);

	if (_currencyLabel) {
		contractName += _currencyLabel;
	}

	if (contracts[contractName]) {
		if (withSigner) {
			return contracts[contractName].connect(_signer);
		}
		return contracts[contractName];
	}

	const _chainId = get(Stores.chainId);
	const _provider = get(Stores.provider);

	//console.log('_chainId', _chainId, _provider);

	if (!_chainId || !_provider) return;

	if (!CHAINDATA[_chainId]) {
		Stores.wrongNetwork.set(true);
		return;
	}
	
	Stores.wrongNetwork.set(false);

	if (!router) {
		const routerAddress = CHAINDATA[_chainId].router;
		const routerAbi = ABIS.router;
		router = new ethers.Contract(routerAddress, routerAbi, _provider);
	}

	const currencies = CHAINDATA[_chainId].currencies;

	// Currencies (ERC20)
	if (!contracts['weth']) {	
		for (const currencyLabel in currencies) {
			contracts[currencyLabel] = new ethers.Contract(currencies[currencyLabel], ABIS.erc20, _provider);
		}
	}

	// CAP (ERC20)
	if (!contracts['cap']) {
		const cap = CHAINDATA[_chainId].cap;
		contracts['cap'] = new ethers.Contract(cap, ABIS.erc20, _provider);
	}

	let address;

	const currency = currencies[_currencyLabel];

	let abiName = contractName;

	if (contractName.toLowerCase().includes('poolrewards')) {
		address = await router.getPoolRewards(currency);
		abiName = 'rewards';
	} else if (contractName.toLowerCase().includes('caprewards')) {
		address = await router.getCapRewards(currency);
		abiName = 'rewards';
	} else if (contractName == 'capPool') {
		address = await router[contractName]();
		abiName = 'pool';
	} else if (contractName.toLowerCase().includes('pool')) {
		address = await router.getPool(currency);
		abiName = 'pool';
	} else {
		address = await router[contractName]();
	}
		
	//console.log('contract address', address);
	
	const abi = ABIS[abiName];

	contracts[contractName] = new ethers.Contract(address, abi, _provider);

	//console.log('contracts', contracts);

	if (withSigner) {
		return contracts[contractName].connect(_signer);
	}
	return contracts[contractName];

}