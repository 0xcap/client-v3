<script>

	import { onMount } from 'svelte'

	import { initChart, loadCandles } from '../../lib/chart'

	onMount(() => {
		initChart();
	});

</script>

<div class='resolution'>
	<a on:click={async () => {await loadCandles(300)}}>5min</a> |
	<a on:click={async () => {await loadCandles(900)}}>15min</a> |
	<a on:click={async () => {await loadCandles(3600)}}>1h</a>
</div>
<div id='chart'></div>