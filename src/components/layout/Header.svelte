<script>
	import Wallet from '../Wallet.svelte'
</script>

<style>

	header {
		height: var(--header-height);
		background-color: var(--eerie-black);
	}

</style>


<header>
	<nav>
		<span class='logo'>Cap</span>
		<a href='/'>Home</a> | 
		<a href='#/trade'>Trade</a> | 
		<a href='#/pool'>Pool</a>
	</nav>
	<Wallet />
</header>