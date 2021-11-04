<script>
	import { onMount } from 'svelte'

	import Button from './layout/Button.svelte'

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
		<div class='address'>{shortAddress($address)}</div>
	{:else}
		<Button small={true} isDisabled={false} onClick={() => {showModal('Connect')}} label={`Connect Wallet`} />
	{/if}

</div>