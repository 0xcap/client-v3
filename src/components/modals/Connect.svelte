<script>
	import Modal from '../modals/Modal.svelte'
	import { connectMetamask, connectWalletConnect } from '../../lib/wallet'
	
</script>

<style>

	.row {
		display: flex;
		align-items: center;
		padding: 0 var(--base-padding);
		border-bottom: 1px solid var(--jet-dim);
		font-size: 120%;
		font-weight: 700;
		cursor: pointer;
		height: 74px;
	}
	.row:not(.selected):hover {
		background-color: var(--jet-dim);
	}
	.row.selected {
		background-color: var(--jet);
		cursor: default !important;
	}
	.row:last-child {
		border-bottom: none;
	}

	.row img {
		max-width: 42px;
		margin-right: 20px;
	}

</style>

<Modal>

	<div class='row' on:click={() => {connectMetamask()}} data-intercept="true">
		<img src='https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg'>
		<div>MetaMask</div>
	</div>

	<div class='row' on:click={() => {connectWalletConnect()}} data-intercept="true">
		<img src='https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/svg/circle/walletconnect-circle-blue.svg'>
		<div>WalletConnect</div>
	</div>

</Modal>