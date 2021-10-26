// Connects to contracts deduced from router, initializes with ethers js
import { get } from 'svelte/store'
import { ethers } from 'ethers'
import { chainId, provider, signer, wrongNetwork } from '../stores/wallet'
import { CHAINDATA, ABIS } from '../utils/constants'

let router;
let contracts = {};

export async function getContract(contractName, withSigner, _currencyLabel) {

	const _signer = get(signer);

	if (_currencyLabel) {
		contractName += _currencyLabel;
	}

	if (contracts[contractName]) {
		if (withSigner) {
			return contracts[contractName].connect(_signer);
		}
		return contracts[contractName];
	}

	const _chainId = get(chainId);
	const _provider = get(provider);

	console.log('_chainId', _chainId, _provider);

	if (!_chainId || !_provider) return;

	if (!CHAINDATA[_chainId]) {
		wrongNetwork.set(true);
		return;
	}
	
	wrongNetwork.set(false);

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
		address = await router.getPoolRewardsContract(currency);
		abiName = 'rewards';
	} else if (contractName.toLowerCase().includes('caprewards')) {
		address = await router.getCapRewardsContract(currency);
		abiName = 'rewards';
	} else if (contractName.toLowerCase().includes('pool')) {
		address = await router.getPoolContract(currency);
		console.log('address__', currency, _currencyLabel, address);
		abiName = 'pool';
	} else {
		address = await router[contractName + 'Contract']();
	}
		
	console.log('contract address', address);
	
	const abi = ABIS[abiName];

	contracts[contractName] = new ethers.Contract(address, abi, _provider);

	console.log('contracts', contracts);

	if (withSigner) {
		return contracts[contractName].connect(_signer);
	}
	return contracts[contractName];

}