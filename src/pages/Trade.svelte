<script>

	import Chart from '../components/chart/Chart.svelte'
	import Order from '../components/order/Order.svelte'
	import Positions from '../components/positions/Positions.svelte'
	import History from '../components/history/History.svelte'

</script>

<div class='trade'>

	<div>Trade</div>

	<Chart/>

	<hr/>

	<Order />

	<hr/>

	<Positions />

	<hr/>

	<History />

</div>