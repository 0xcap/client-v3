<script>

	import Ticker from '../Ticker.svelte'
	import ChartResolution from '../ChartResolution.svelte'
	import Chart from '../Chart.svelte'
	import Order from '../Order.svelte'
	import Positions from '../Positions.svelte'
	import History from '../History.svelte'

	let panel = 'positions';

	function selectPanel(_panel) {
		panel = _panel;
	}

	amplitude.getInstance().logEvent('Trade');

</script>

<style>

	.trade {
		display: grid;
		grid-gap: var(--grid-gap);
		grid-auto-flow: row;
		grid-template-rows: calc(var(--ticker-height) + var(--chart-resolution-height) + var(--chart-height) + 3 * var(--grid-gap)) auto;
		background-color: var(--rich-black-fogra);
		position: absolute;
		top: calc(var(--header-height) + var(--grid-gap));
		bottom: 0;
		left: 0;
		right: 0;
	}

	.core {
		order: 1;
		display: grid;
		grid-gap: var(--grid-gap);
		grid-auto-flow: column;
		grid-template-columns: auto 300px;
	}

	.core .sidebar {
		order: 2;
		background-color: var(--eerie-black);
	}

	.core .data {
		order: 1;
		display: grid;
		grid-gap: var(--grid-gap);
		grid-auto-flow: row;
		grid-template-rows: var(--ticker-height) var(--chart-resolution-height) var(--chart-height) auto;
	}

	.account {
		order: 2;
		position: relative;
		background-color: var(--eerie-black);
	}

	.account-nav {
		padding: 0 var(--base-padding);
		display: flex;
		height: 42px;
		align-items: center;
		border-bottom: 1px solid var(--jet-dim);
	}

	.account-list {
		position: absolute;
		top: 42px;
		bottom: 0;
		left: 0;
		right: 0;
		min-height: 100px;
		background-color: var(--eerie-black);
	}

	.account-nav a {
		color: var(--sonic-silver);
		margin-right: var(--base-padding);
		font-weight: 500;
	}
	.account-nav a:hover {
		color: #fff;
	}
	.account-nav a.active {
		color: var(--green);
		font-weight: 600;
	}

	@media (max-width: 600px) {
		
		.trade {
			display: grid;
			grid-gap: var(--grid-gap);
			grid-auto-flow: row;
			grid-template-rows: unset;
			grid-template-columns: unset;
			overflow-y: scroll;
		}

		.core {
			display: grid;
			grid-gap: var(--grid-gap);
			grid-auto-flow: row;
			grid-template-columns: unset;
		}

		.account-list {
			min-height: 300px;
		}

	}

</style>

<div class='trade no-scrollbar' id='trade'>

	<div class='core'>

		<div class='sidebar'>
			<Order />
		</div>

		<div class='data'>
			<Ticker />
			<ChartResolution />
			<Chart/>
		</div>

	</div>

	<div class='account'>

		<div class='account-nav'>
			<a class:active={panel == 'positions'} on:click={() => {selectPanel('positions')}}>Positions</a>
			<a class:active={panel == 'history'} on:click={() => {selectPanel('history')}}>History</a>
		</div>

		<div class='account-list'>
			{#if panel == 'positions'}
				<Positions />
			{/if}
			{#if panel == 'history'}
				<History />
			{/if}
		</div>

	</div>

</div>