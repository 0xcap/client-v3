<script>
	import { _ } from '../../services/i18n';

	import Modal from '../modals/Modal.svelte'
	import Button from '../layout/Button.svelte'

	import { switchChains } from '../../lib/wallet'
</script>

<style>

	.note {
		padding: var(--base-padding);
		line-height: 1.618;
	}

</style>

<Modal title={$_('net.invalid')} showHeader={true}>

	<div class='note'>
		{$_('net.note')}
	</div>

	<Button wrap={true} onClick={() => {switchChains()}} label={$_('net.switch')} />

</Modal>