<script>
	export let isRed = false;
	export let isLoading = false;
	export let onClick = null;
	export let label;
	export let wrap = false;
	export let small = false;

</script>

<style>

	button {
		padding: 0 var(--base-padding);
		height: 48px;
		border-radius: var(--base-radius);
		font-weight: 700;
		color: var(--green-dark);
		background-color: var(--green);
		white-space: nowrap;
	}

	button.small {
		height: 36px;
		padding: 0 12px;
	}

	button.red {
		color: var(--red-dark);
		background-color: var(--red);
	}

	button:not(.loading):hover {
		background-color: var(--green-dim);
	}
	button.red:not(.loading):hover {
		background-color: var(--red-dim);
	}

	button.loading {
		pointer-events: none;
		cursor: not-allowed !important;
		color: var(--sonic-silver);
		background-color: var(--onyx);
	}

	.wrap {
		padding: var(--base-padding);
		border-top: 1px solid var(--rich-black);
		background-color: var(--jet-dim);
	}

</style>

{#if wrap}
<div class='wrap'>
	<button class:loading={isLoading} class:red={isRed} on:click={onClick} data-intercept='true'>{label}</button>
</div>
{:else}
<button class:small={small} class:loading={isLoading} class:red={isRed} on:click={onClick} data-intercept='true'>{label}</button>
{/if}