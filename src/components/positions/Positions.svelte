<script>

	import { positions } from '../../stores/positions'
</script>

<div class='positions'>

	<h2>Positions</h2>

	{#each $positions as position}
		<div>{position.product} | {position.price} | {position.amount}</div>
	{/each}

</div>