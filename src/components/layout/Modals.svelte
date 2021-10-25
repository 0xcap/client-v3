<script>
	import { activeModal } from '../../stores/ui'

	import Connect from '../wallet/Connect.svelte'
</script>

<Connect isActive={$activeModal && $activeModal.name == 'Connect'} />