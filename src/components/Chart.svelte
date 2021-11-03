<script>

	import { onMount } from 'svelte'

	import { initChart, setResolution } from '../lib/chart'

	import { chartResolution } from '../lib/stores'

	onMount(() => {
		initChart();
	});

</script>

<style>

	.resolution {
		display: flex;
		align-items: center;
		height: 30px;
	}

	.selected {
		font-weight: 700;
	}

	#chart {
		min-height: var(--chart-height);
	}
</style>

<div class='resolution'>
	<a class:selected={$chartResolution == 300} on:click={async () => {await setResolution(300)}}>5min</a> |
	<a class:selected={$chartResolution == 900} on:click={async () => {await setResolution(900)}}>15min</a> |
	<a class:selected={$chartResolution == 3600} on:click={async () => {await setResolution(3600)}}>1h</a>
</div>
<div id='chart'></div>