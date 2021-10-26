<script>

	import { onMount } from 'svelte'

	import { initChart } from '../../lib/chart'

	onMount(() => {
		initChart();
	});

</script>

<div id='chart'></div>