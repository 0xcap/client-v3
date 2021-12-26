// Connects to contracts deduced from router, initializes with ethers js
import { get } from 'svelte/store'
import { ethers } from 'ethers'
import { CHAINDATA, ABIS } from './constants'
import { showModal, hideModal } from './utils'
import * as Stores from './stores'

let router;
let contracts = {};
let ack_network = false;

export async function getContract(contractName, withSigner, _currencyLabel) {

	// console.log('gc', contractName, withSigner, _currencyLabel);

	const _signer = get(Stores.signer);

	if (_currencyLabel) {
		contractName += _currencyLabel;
	}

	const _chainId = get(Stores.chainId);
	const _provider = get(Stores.provider);

	// console.log('_chainId', _chainId, _provider, ack_network, CHAINDATA[_chainId]);

	if (!_chainId || !_provider) return;

	if (!CHAINDATA[_chainId]) {
		Stores.wrongNetwork.set(true);
		if (!ack_network) {
			showModal('Network');
			// ack_network = true;
		}
		return;
	}
	
	// hideModal();
	Stores.wrongNetwork.set(false);

	if (contracts[contractName]) {
		if (withSigner) {
			return contracts[contractName].connect(_signer);
		}
		return contracts[contractName];
	}

	if (!router) {
		const routerAddress = CHAINDATA[_chainId].router;
		const routerAbi = ABIS.router;
		router = new ethers.Contract(routerAddress, routerAbi, _provider);
	}

	if (contractName == 'router') return router;

	const currencies = CHAINDATA[_chainId].currencies;

	// Currencies (ERC20)
	if (!contracts['weth'] || !contracts['usdc']) {	
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

	if (contractName.toLowerCase().includes('oldpoolrewards')) {
		if (_currencyLabel == 'weth') {
			address = '0x9190338f23bE9024A9F9628E44cd169926fE7795';
		} else if (_currencyLabel == 'usdc') {
			address = '0x996DA299Fb8247dbc2ef45299b62B897d89C01D4';
		}
		abiName = 'rewards';
	} else if (contractName.toLowerCase().includes('oldpool')) {
		if (_currencyLabel == 'weth') {
			address = '0xB224F2689BC0aFc5b6721a0807d07017D8CDddf8';
		} else if (_currencyLabel == 'usdc') {
			address = '0x07B0B00B9008798055071dde6f2d343782b35dC6';
		}
		abiName = 'pool';
	} else if (contractName.toLowerCase().includes('poolrewards')) {
		address = await router.getPoolRewards(currency);
		// if (_currencyLabel == 'weth') {
		// 	address = '0x29163356bBAF0a3bfeE9BA5a52a5C6463114Cb5f';
		// } else if (_currencyLabel == 'usdc') {
		// 	address = '0x10f2f3B550d98b6E51461a83AD3FE27123391029';
		// }
		abiName = 'rewards';
	} else if (contractName.toLowerCase().includes('caprewards')) {
		address = await router.getCapRewards(currency);
		abiName = 'rewards';
	} else if (contractName == 'capPool') {
		address = await router[contractName]();
		abiName = 'pool';
	} else if (contractName.toLowerCase().includes('pool')) {
		address = await router.getPool(currency);
		// if (_currencyLabel == 'weth') {
		// 	address = '0xE0cCd451BB57851c1B2172c07d8b4A7c6952a54e';
		// } else if (_currencyLabel == 'usdc') {
		// 	address = '0x958cc92297e6F087f41A86125BA8E121F0FbEcF2';
		// }
		abiName = 'pool';
	} else {
		address = await router[contractName]();
	}
		
	// console.log('contract address', abiName, address);
	
	const abi = ABIS[abiName];

	contracts[contractName] = new ethers.Contract(address, abi, _provider);

	// console.log('contracts', contracts);

	if (withSigner) {
		return contracts[contractName].connect(_signer);
	}
	return contracts[contractName];

}