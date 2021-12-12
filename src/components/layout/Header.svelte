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
		color: var(--silver-chalice);
		margin-right: 26px;
		font-weight: 500;
	}

	@media (max-width: 600px) {
		.left a {
			margin-right: 12px;
		}
	}

	.left a:hover {
		color: #fff;
	}

	.left a.active {
		color: var(--green);
		font-weight: 600;
	}

	img {
		height: 12px;
		filter: grayscale(1);
		opacity: 0.65;
	}

	a:hover img {
		filter: grayscale(1);
		opacity: 1;
	}

	a.active img {
		filter: grayscale(0);
		opacity: 1;
	}

</style>

{#if $currentPage != 'home'}
<header>

	<div class='left'>
		<a class:active={$currentPage == 'home' || !$currentPage} href='/'>
			<img src='/logos/CAP.svg' title='CAP logo' alt='CAP logo' />
		</a>
		<a class:active={$currentPage == 'trade'} href='#/trade'>Trade</a>
		<a class:active={$currentPage == 'pool'} href='#/pool'>Pool</a>
		<a href='https://docs.cap.finance' target='_blank'>Docs</a>
	</div>

	<div class='right'>
		<Wallet />
	</div>
	
</header>
{/if}