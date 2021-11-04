<script>

	import { onMount } from 'svelte'
	import { initChart } from '../lib/chart'

	onMount(() => {
		initChart();
	});

</script>

<style>

	#chart {
		min-height: var(--chart-height);
	}
</style>

<div id='chart'></div>