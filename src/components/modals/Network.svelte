<script>
	import Modal from '../modals/Modal.svelte'
</script>

<style>

	.note {
		padding: var(--base-padding);
		line-height: 1.618;
	}

</style>

<Modal title='Invalid Network' showHeader={true}>

	<div class='note'>
		Select Arbitrum as your wallet network to trade or pool on Cap. Details on how to do this are available <a href='https://docs.cap.finance/setting-up-your-wallet' target='_blank'>here</a>.
	</div>

</Modal>