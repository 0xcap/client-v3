<script>
	import { onMount } from 'svelte'

	import { checkMetamaskSession } from '../lib/wallet'

	import { address, wrongNetwork } from '../lib/stores'

	import { shortAddress, showModal } from '../lib/utils'

	onMount(async () => {
		await checkMetamaskSession();
	});

</script>

<style>

</style>

<div class='wallet'>

	{#if $wrongNetwork}
	Wrong network
	{/if}

	{#if $address}
		<div class='address' on:click={() => {showModal('WalletDetails')}} data-intercept='true'>{shortAddress($address)}</div>
	{:else}
		<button on:click={() => {showModal('Connect')}} data-intercept='true'>Connect Wallet</button>
	{/if}

</div>