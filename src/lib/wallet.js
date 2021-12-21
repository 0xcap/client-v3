// Client side wallet interactions
import { ethers } from 'ethers'
import { initEventListeners } from './events'
import { hydrateData } from './data'
import { CHAINDATA } from './constants'
import { showToast, hideModal } from './utils'
import { chainId, signer, provider, address } from './stores'

let _provider = new ethers.providers.JsonRpcProvider('https://arb1.arbitrum.io/rpc');
provider.set(_provider);
chainId.set(42161);
let _walletConnect;

export async function checkMetamaskSession() {
	if (window.ethereum) connectMetamask(true);
}

export async function connectMetamask(resume) {

	let metamask = window.ethereum;
	if (!metamask && !resume) return showToast('Metamask is not installed.');
	
	_provider = new ethers.providers.Web3Provider(metamask);

	let accounts;
	if (resume) {
		accounts = await _provider.send('eth_accounts');
	} else {
		accounts = await _provider.send("eth_requestAccounts", []);
		hideModal();
	}

	if (!accounts || !accounts.length) return;

	const network = await _provider.getNetwork();
	chainId.set(network.chainId);
	metamask.on('chainChanged', (_chainId) => {
		window.location.reload();
	});

	provider.set(_provider);

	if (accounts.length) {
		handleAccountsChanged();
	} else {
		hydrateData();
	}
	metamask.on('accountsChanged', handleAccountsChanged);

}

export async function connectWalletConnect() {

	let script = document.createElement("script");
	script.setAttribute("src", "https://unpkg.com/@walletconnect/web3-provider@1.6.6/dist/umd/index.min.js");
	document.body.appendChild(script);

	script.addEventListener("load", scriptLoaded, false);

	async function scriptLoaded() {

		_walletConnect = new WalletConnectProvider.default({
			rpc: {
				42161: CHAINDATA[42161].rpc
			}
		});

		await _walletConnect.enable();

		hideModal();

		_provider = new ethers.providers.Web3Provider(_walletConnect);

		provider.set(_provider);
		const network = await _provider.getNetwork();
		chainId.set(network.chainId);

		handleAccountsChanged();

		// Subscribe to accounts change
		_walletConnect.on("accountsChanged", handleAccountsChanged);

		// Subscribe to chainId change
		_walletConnect.on("chainChanged", (chainId) => {
			window.location.reload();
		});

		// Subscribe to session disconnection
		_walletConnect.on("disconnect", (code, reason) => {
			console.log('disconnect', code, reason);
			window.location.reload();
		});

	}

}

export async function disconnectWallet(force) {
	if (force && _walletConnect) await _walletConnect.disconnect();
	signer.set(null);
}

export async function switchChains() {

	let wallet;
	if (window.ethereum) {
		wallet = window.ethereum;
	} else {
		wallet = _walletConnect;
	}

	if (!wallet) return showToast("Can't connect to wallet.");

	try {
		await wallet.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId: '0xA4B1' }],
		});
	} catch (switchError) {
		// This error code indicates that the chain has not been added to MetaMask.
		if (switchError.code === 4902) {
			try {
				await wallet.request({
					method: 'wallet_addEthereumChain',
					params: [{
						chainId: '0xA4B1',
						chainName: 'Arbitrum One',
						rpcUrls: [CHAINDATA[42161]['rpc']],
						nativeCurrency: {
							name: 'ETH',
							symbol: 'ETH',
							decimals: 18
						},
						blockExplorerUrls: [CHAINDATA[42161]['explorer']]
					}],
				});
			} catch (addError) {
				// handle "add" error
			}
		}
		// handle other "switch" errors
	}

}

async function handleAccountsChanged() {
	const _signer = _provider.getSigner();
	signer.set(_signer);
	const _address = await _signer.getAddress();
	address.set(_address);
	amplitude.getInstance().setUserId(_address);
	hydrateData();
	initEventListeners();
}

function handleDisconnect() {

}