<script>
	import { activeModal } from '../../lib/stores'

	import Connect from '../modals/Connect.svelte'
	import Products from '../modals/Products.svelte'
	import Leverage from '../modals/Leverage.svelte'
	import Currencies from '../modals/Currencies.svelte'
	import ClosePosition from '../modals/ClosePosition.svelte'
	import PositionDetails from '../modals/PositionDetails.svelte'
	import TradeDetails from '../modals/TradeDetails.svelte'
	
	import PoolDeposit from '../modals/PoolDeposit.svelte'
	import PoolWithdraw from '../modals/PoolWithdraw.svelte'
	
	import LegacyPositions from '../modals/LegacyPositions.svelte'
</script>

{#if $activeModal && $activeModal.name == 'Connect'}
<Connect />
{/if}

{#if $activeModal && $activeModal.name == 'Products'}
<Products />
{/if}

{#if $activeModal && $activeModal.name == 'LegacyPositions'}
<LegacyPositions data={$activeModal.data} />
{/if}

<TradeDetails isActive={$activeModal && $activeModal.name == 'TradeDetails'}  data={$activeModal.data} />

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

{#if $activeModal && $activeModal.name == 'PoolDeposit'}
	<PoolDeposit data={$activeModal.data} />
{/if}

{#if $activeModal && $activeModal.name == 'PoolWithdraw'}
	<PoolWithdraw data={$activeModal.data} />
{/if}
