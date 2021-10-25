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

	if (!_chainId || !_provider) return;

	if (!router) {
		const routerAddress = CHAINDATA[chainId].router;
		const routerAbi = ABIS.router;
		router = new ethers.Contract(routerAddress, routerAbi, provider);
	}

	const methodName = contractName + 'Address';

	const address = await router[methodName]();
	
	let abiName = contractName;
	if (abiName.includes('pool')) abiName = 'pool';
	if (abiName.includes('rewards')) abiName = 'rewards';
	
	const abi = ABIS[abiName];

	contracts[contractName] = new ethers.Contract(address, abi, provider);

	if (withSigner) {
		return contracts[contractName].connect(_signer);
	}
	return contracts[contractName];

}