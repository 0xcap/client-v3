<script>
	import { activeModal } from '../../stores/ui'

	import Connect from '../modals/Connect.svelte'
	import Products from '../modals/Products.svelte'
	import Leverage from '../modals/Leverage.svelte'
	import Currencies from '../modals/Currencies.svelte'
	
</script>

<Connect isActive={$activeModal && $activeModal.name == 'Connect'} />
<Products isActive={$activeModal && $activeModal.name == 'Products'} />

{#if $activeModal && $activeModal.name == 'Leverage'}
<Leverage />
{/if}

{#if $activeModal && $activeModal.name == 'Currencies'}
<Currencies />
{/if}