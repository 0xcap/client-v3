// Connects to contracts deduced from router, initializes with ethers js
import { get } from 'svelte/store'
import { ethers } from 'ethers'
import { chainId, provider, signer } from '../stores/wallet'
import { CHAINDATA, ABIS } from '../utils/constants'

let router;
let contracts = {};

export async function getContract(contractName, withSigner) {

	const _signer = get(signer);

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

	if (!router) {
		const routerAddress = CHAINDATA[_chainId].router;
		const routerAbi = ABIS.router;
		router = new ethers.Contract(routerAddress, routerAbi, _provider);
	}

	const methodName = contractName + 'Contract';

	console.log('methodName', methodName);

	const address = await router[methodName]();
		
	console.log('address', address);

	let abiName = contractName;
	if (abiName.includes('pool')) abiName = 'pool';
	if (abiName.includes('rewards')) abiName = 'rewards';
	
	const abi = ABIS[abiName];

	contracts[contractName] = new ethers.Contract(address, abi, _provider);

	if (withSigner) {
		return contracts[contractName].connect(_signer);
	}
	return contracts[contractName];

}