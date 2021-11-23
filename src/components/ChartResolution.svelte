<script>

	import { setResolution } from '../lib/chart'
	import { chartResolution } from '../lib/stores'

</script>

<style>

	.resolution {
		display: flex;
		align-items: center;
		background-color: var(--eerie-black);
		height: var(--chart-resolution-height);
		padding: 0 var(--base-padding);
	}

	a {
		color: var(--sonic-silver);
		margin-right: var(--base-padding);
	}

	a:hover {
		color: var(--green);
	}

	.active {
		color: var(--green);
		font-weight: 700;
	}

</style>

<div class='resolution'>
	<a class:active={$chartResolution == 60} on:click={async () => {await setResolution(60)}}>1m</a>
	<a class:active={$chartResolution == 300} on:click={async () => {await setResolution(300)}}>5m</a>
	<a class:active={$chartResolution == 900} on:click={async () => {await setResolution(900)}}>15m</a>
	<a class:active={$chartResolution == 3600} on:click={async () => {await setResolution(3600)}}>1h</a>
	<a class:active={$chartResolution == 21600} on:click={async () => {await setResolution(21600)}}>6h</a>
	<a class:active={$chartResolution == 86400} on:click={async () => {await setResolution(86400)}}>1D</a>
</div>