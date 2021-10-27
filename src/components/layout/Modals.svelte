<script>
	import { activeModal } from '../../stores/ui'

	import Connect from '../modals/Connect.svelte'
	import Products from '../modals/Products.svelte'
	import Leverage from '../modals/Leverage.svelte'
	import Currencies from '../modals/Currencies.svelte'
	import ClosePosition from '../modals/ClosePosition.svelte'
	import PositionDetails from '../modals/PositionDetails.svelte'
	import AddMargin from '../modals/AddMargin.svelte'
	
</script>

<Connect isActive={$activeModal && $activeModal.name == 'Connect'} />
<Products isActive={$activeModal && $activeModal.name == 'Products'} />

{#if $activeModal && $activeModal.name == 'Leverage'}
<Leverage />
{/if}

{#if $activeModal && $activeModal.name == 'Currencies'}
<Currencies />
{/if}

{#if $activeModal && $activeModal.name == 'ClosePosition'}
<ClosePosition data={$activeModal.data} />
{/if}
{#if $activeModal && $activeModal.name == 'PositionDetails'}
	<PositionDetails data={$activeModal.data} />
{/if}
{#if $activeModal && $activeModal.name == 'AddMargin'}
	<AddMargin data={$activeModal.data} />
{/if}