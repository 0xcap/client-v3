<script>

	import { onMount } from 'svelte'

	import { initChart, setResolution } from '../../lib/chart'

	import { chartResolution } from '../../stores/ui'

	onMount(() => {
		initChart();
	});

</script>

<style>
	.selected {
		font-weight: 700;
	}

	#chart {
		min-height: 400px;
	}
</style>

<div class='resolution'>
	<a class:selected={$chartResolution == 300} on:click={async () => {await setResolution(300)}}>5min</a> |
	<a class:selected={$chartResolution == 900} on:click={async () => {await setResolution(900)}}>15min</a> |
	<a class:selected={$chartResolution == 3600} on:click={async () => {await setResolution(3600)}}>1h</a>
</div>
<div id='chart'></div>