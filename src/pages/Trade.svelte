<script>

	import Chart from '../components/chart/Chart.svelte'
	import Order from '../components/order/Order.svelte'
	import Positions from '../components/positions/Positions.svelte'
	import History from '../components/history/History.svelte'

</script>

<style>

	.trading-row {
		display: flex;
	}

	.chart {
		flex: 1 1 auto;
	}

	.order {
		width: 33.333%;
	}

</style>

<div class='trade'>

	<div class='trading-row'>
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