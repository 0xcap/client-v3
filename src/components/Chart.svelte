<script>

	import { onMount } from 'svelte'
	import { initChart } from '../lib/chart'

	onMount(() => {
		initChart();
	});

</script>

<style>
	#chart {
		height: var(--chart-height);
	}
</style>

<div id='chart'></div>