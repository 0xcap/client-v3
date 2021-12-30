<script>
	import Wallet from '../Wallet.svelte'

	import { currentPage } from '../../lib/stores'
</script>

<style>

	header {
		background-color: var(--eerie-black);
	}

	.inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 var(--base-padding);
		height: var(--header-height);
	}

	.home {
		max-width: 960px;
		margin: 0 auto;
	}

	.left {
		display: flex;
		align-items: center;
	}

	.link {
		color: var(--silver-chalice);
		margin-right: 14px;
		font-weight: 500;
		padding: 6px 12px;
		border-radius: var(--base-radius);
	}

	.logo {
		margin-right: 26px;
	}

	@media (max-width: 600px) {
		.logo {
			margin-right: 12px;
		}
		.link {
			margin-right: 0;
		}
	}

	.link:hover {
		color: #fff;
		background-color: #242424;
	}

	.link.active {
		color: var(--green);
		font-weight: 600;
		background-color: #1B261B;
	}

	img {
		height: 12px;
		filter: grayscale(1);
		opacity: 0.65;
	}

	.logo:hover img {
		filter: grayscale(1);
		opacity: 1;
	}

	.logo.active img {
		filter: grayscale(0);
		opacity: 1;
	}

</style>

<header>

	<div class='inner' class:home={!$currentPage || $currentPage == 'home'}>

		<div class='left'>
			<a class='logo' class:active={!$currentPage || $currentPage == 'home'} href='/'>
				<img src='/logos/CAP.svg' title='CAP Home' alt='CAP Home' />
			</a>
			<a class='link' class:active={$currentPage == 'trade'} href='#/trade'>Trade</a>
			<a class='link' class:active={$currentPage == 'pool'} href='#/pool'>Pool</a>
			<a class='link' href='https://docs.cap.finance' target='_blank'>Docs</a>
		</div>

		<div class='right'>
			<Wallet />
		</div>

	</div>
	
</header>