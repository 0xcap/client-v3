<script>

	import { onMount } from 'svelte'
	import { initChart } from '../lib/chart'
	import { chartLoading } from '../lib/stores'

	onMount(() => {
		initChart();
	});

</script>

<style>
	#chart {
		background-color: var(--eerie-black);
		height: calc(var(--chart-height) + var(--grid-gap));
	}
	.loading {
		opacity: 0.8;
		pointer-events: none;
	}
</style>

<div id='chart' class:loading={$chartLoading}></div>