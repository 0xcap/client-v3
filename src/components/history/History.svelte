<script>

	import { history } from '../../stores/history'

</script>

<div class='history'>

	<h2>History</h2>


	{#each $history as item}
		<div>{item.product} | {item.price} | {item.amount}</div>
	{/each}

</div>