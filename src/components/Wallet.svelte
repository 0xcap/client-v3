<script>
	import { onMount } from 'svelte'

	import Button from './layout/Button.svelte'

	import { checkMetamaskSession } from '../lib/wallet'

	import { address, wrongNetwork, currentPage } from '../lib/stores'

	import { shortAddress, showModal } from '../lib/utils'

	onMount(async () => {
		await checkMetamaskSession();
	});

</script>

<style>

	.wallet {
		display: flex;
		align-items: center;
	}

	.wrong-network {
		color: var(--orange);
		padding-right: var(--base-padding);
		white-space: nowrap;
	}

	@media (max-width: 600px) {
		.wrong-network {
			display: none;
		}
	}

</style>

<div class='wallet'>

	{#if $address && $wrongNetwork}
	<div class='wrong-network'>Switch to Arbitrum</div>
	{/if}

	{#if $address}
		<div class='address'>{shortAddress($address)}</div>
	{:else}
		{#if $currentPage != 'home'}
		<Button small={true} onClick={() => {showModal('Connect')}} label={`Connect Wallet`} />
		{/if}
	{/if}

</div>