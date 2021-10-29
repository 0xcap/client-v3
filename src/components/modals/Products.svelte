<script>
	
	import Modal from './Modal.svelte'

	import { productId } from '../../lib/stores'

	import { selectProduct } from '../../lib/methods'

	import { hideModal, shortSymbol } from '../../lib/utils'
	import { PRODUCTS } from '../../lib/constants'

	export let isActive;
	
</script>

<style>

	.row {
		display: flex;
		align-items: center;
		padding: 0 var(--base-padding);
		border-bottom: 1px solid var(--jet-dim);
		font-size: 120%;
		font-weight: 700;
		cursor: pointer;
		height: 74px;
	}
	.row:not(.selected):hover {
		background-color: var(--jet-dim);
	}
	.row.selected {
		background-color: var(--jet);
		cursor: default !important;
	}
	.row:last-child {
		border-bottom: none;
	}

	.row img {
		max-width: 42px;
		margin-right: 20px;
	}

</style>

<Modal isActive={isActive}>

	{#each Object.entries(PRODUCTS) as [_productId, _product]}

		<div class='row' class:selected={_productId == $productId} on:click={async () => {await selectProduct(_productId); hideModal()}} data-intercept="true">

			<div class='product-wrap'>
				<img src={PRODUCTS[_productId].logo} alt={`${_product.symbol} logo`}>
				<span>{shortSymbol(_product.symbol)}</span>
			</div>

		</div>

	{/each}

</Modal>