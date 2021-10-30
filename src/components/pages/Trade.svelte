<script>

	import Chart from '../Chart.svelte'
	import Order from '../Order.svelte'
	import Positions from '../Positions.svelte'
	import History from '../History.svelte'

</script>

<style>

	.trading-row {
		display: flex;
		justify-content: space-between;
	}

	.chart {
		flex: 1 1 auto;
	}

	.order {
		width: 38.2%;
	}

</style>

<div class='trade'>

	<div class='trading-row' id='trading-row'>
		<div class='chart'>
			<Chart/>
		</div>
		<div class='order'>
			<Order />
		</div>
	</div>

	<hr/>

	<Positions />

	<hr/>

	<History />

</div>