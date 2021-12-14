<script>
	import { toast } from '../../lib/stores'
	import { hideToast } from '../../lib/utils'
	import { CANCEL_ICON } from '../../lib/icons'
</script>

<style>

	.toast-container {
		position: fixed;
		top: var(--base-padding);
		left: 0;
		right: 0;
		z-index: 101;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
	}

	.toast {
		border-radius: var(--base-radius);
		display: flex;
		justify-content: space-between;
		padding: 10px;
		max-width: 620px;
		pointer-events: auto;
	}

	@media (max-width: 660px) {
		.toast {
			max-width: 420px;
		}
	}

	.toast.error {
		background-color: var(--red-dark);
		color: var(--red);
		fill: var(--red);
	}
	.toast.success {
		background-color: var(--green-dark);
		fill: var(--green);
		color: var(--green);
	}

	.body {
		padding-right: var(--base-padding);
		word-break: break-word;
		font-weight: 650;
		line-height: 1.4;
	}

	:global(.toast .close svg) {
		height: 14px;
		width:  14px;
		margin-bottom: -2px;
		fill: inherit;
	}

</style>

{#if $toast}
<div class='toast-container'>
	<div class={`toast ${$toast.type || 'error'}`} data-intercept="true">
		<div class='body'>
			{$toast.message}
		</div>
		<a class='close' on:click={() => {hideToast()}}>{@html CANCEL_ICON}</a>
	</div>
</div>
{/if}