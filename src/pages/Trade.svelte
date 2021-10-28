<script>

	import Chart from '../components/chart/Chart.svelte'
	import Order from '../components/order/Order.svelte'
	import Positions from '../components/positions/Positions.svelte'
	import History from '../components/history/History.svelte'

</script>

<style>

	.trading-row {
		display: flex;
		justify-content: space-between;
	}

	.chart {
		flex: 1 1 auto;
		padding-left: 20px;
	}

	.order {
		width: 33.333%;
	}

</style>

<div class='trade'>

	<div class='trading-row' id='trading-row'>
		<div class='order'>
			<Order />
		</div>
		<div class='chart'>
			<Chart/>
		</div>
	</div>

	<hr/>

	<Positions />

	<hr/>

	<History />

</div>