<script>
	import Wallet from '../Wallet.svelte'

	import { currentPage } from '../../lib/stores'
</script>

<style>

	header {
		padding: 0 var(--base-padding);
		height: var(--header-height);
		background-color: var(--eerie-black);
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.left {
		display: flex;
		align-items: center;
	}

	.left a {
		color: var(--sonic-silver);
		margin-right: var(--base-padding);
	}

	.left a.active {
		color: var(--green);
		font-weight: 700;
	}

</style>


<header>

	<div class='left'>
		<a class:active={$currentPage == 'home' || !$currentPage} href='/'>Cap</a>
		<a class:active={$currentPage == 'trade'} href='#/trade'>Trade</a>
		<a class:active={$currentPage == 'pool'} href='#/pool'>Pool</a>
	</div>

	<div class='right'>
		<Wallet />
	</div>
	
</header>