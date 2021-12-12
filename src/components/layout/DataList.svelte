<script>

	import { onMount } from 'svelte'

	import { showModal } from '../../lib/utils'

	export let data;
	export let onSubmit = null;
	export let value = '';

	onMount(() => {
		setTimeout(() => {
			document.getElementById('amount') && document.getElementById('amount').focus();
		}, 100);
	});

</script>

<style>

	.data-list {
	}

	.row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid var(--jet-dim);
		padding: var(--base-padding);
	}

	.row:last-child {
		border-bottom: none;
	}

	.input-row {
		position: relative;
		padding: var(--base-padding);
		border-bottom: 1px solid var(--rich-black);
	}

	.input-label {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		pointer-events: none;
		left: calc(2 * var(--base-padding));
	}

	input:hover, input:focus {
		border-color: var(--green);
	}

	input {
		background-color: var(--onyx-dim);
		border-radius: var(--base-radius);
		border: 1px solid var(--onyx-dim);
		padding: 12px var(--base-padding);
		width: 100%;
		box-sizing: border-box;
		text-align: right;
	}

	.label {
		display: flex;
		align-items: center;
		color: var(--sonic-silver);
	}

	.error {
		color: var(--orange);
	}

	.dim {
		color: var(--dim-gray);
	}

	.anterior {
		color: var(--sonic-silver);
	}

	.clickable {
		color: var(--green);
		cursor: pointer;
	}

	:global(.row .value svg) {
		fill: var(--green);
		height: 16px;
		margin-bottom: -3px;
	}

</style>


<div class='data-list'>
	{#each data as row}
		{#if row.type == 'input'}
			<div class='input-row'>
				<div class='input-label'>{row.label}</div>
				<form on:submit|preventDefault={onSubmit}>
					<input id='amount' type='number' step="0.0001" bind:value={value} min="0" max="1000000" maxlength="10" spellcheck="false" placeholder={`0.0`} autocomplete="off" autocorrect="off" inputmode="decimal" on:keyup={row.onKeyUp} lang="en">
				</form>
			</div>
		{:else}
			{#if row.value !== null}
				<div class='row'>
					<div class='label'>{row.label}</div>
					<div class:error={!row.isEmpty && row.hasError} class:dim={row.dim} class:clickable={Boolean(row.onclick)} on:click={row.onclick} class:pos={row.isPnl && row.rawValue * 1 >= 0}  class:neg={row.isPnl && row.rawValue * 1 < 0} class='value'>
						{#if row.anteriorValue}
						<span class='anterior'>{row.anteriorValue}→</span>
						{/if}
						{#if row.renderHTML}
							{@html row.value}
						{:else if row.isEmpty}
							-
						{:else}
							{row.value}
						{/if}
					</div>
				</div>
			{/if}
		{/if}
	{/each}
</div>