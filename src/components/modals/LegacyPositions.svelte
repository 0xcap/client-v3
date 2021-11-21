<script>
	import Modal from './Modal.svelte'

	export let data;
</script>

<style>
	div {
		width: 90%;
		margin: 10px auto;
	}
	p {
		line-height: 1.618;
	}

	ul {
		margin: 0 auto;
	}
	li {
		line-height: 1.618;
		padding: 10px 0;
	}
</style>

<Modal>
	<div>
		<p>You also have open positions against previous versions of the Cap protocol that will not show up in this version. To view them, follow the links below:</p>
		<ul>
			{#each data as d}
				<li>{d.message}<br /><a href={d.href} target="_blank">{d.href}</a></li>
			{/each}
		</ul>
	</div>
</Modal>