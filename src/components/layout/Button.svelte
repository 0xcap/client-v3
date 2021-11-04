<script>
	export let isRed = false;
	export let isLoading = false;
	export let isDisabled = false;
	export let onClick = null;
	export let label;
	export let wrap = false;

</script>

<style>

	button {
		padding: 0 var(--base-padding);
		height: 48px;
		border-radius: var(--base-radius);
		font-weight: 700;
		color: var(--green-dark);
		background-color: var(--green);
	}

	button.red {
		color: var(--red-dark);
		background-color: var(--red);
	}

	button.loading {
		background-color: var(--jet);
		color: var(--dim-gray);
		pointer-events: none;
		cursor: default;
	}

	.wrap {
		padding: var(--base-padding);
	}

</style>

{#if wrap}
<div class='wrap'>
	<button class:loading={isLoading} class:red={isRed} class:disabled={isDisabled} on:click={onClick}>{label}</button>
</div>
{:else}
<button class:loading={isLoading} class:red={isRed} class:disabled={isDisabled} on:click={onClick}>{label}</button>
{/if}