<script>
	import Volume from '../Volume.svelte'

	import { EXTERNAL_ICON, DISCORD_ICON, TWITTER_ICON, TELEGRAM_ICON, GITHUB_ICON, ARBITRUM_ICON } from '../../lib/icons'

	import { quartOut } from 'svelte/easing';
	import { blur } from 'svelte/transition';

</script>
<style>

	.home-wrap {
		padding: var(--base-padding);
		background-color: #1A201A;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		overflow-y: scroll;
	}

	.home {
		margin: 0 auto;
		max-width: 720px;
	}

	.hero {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 64px 0;
	}

	.hero-inner {		
		display: grid;
		grid-auto-flow: row;
		grid-gap: 36px;
		text-align: center;
	}

	.main-title {
	}

	.main-title img {
		height: 60px;
	}

	.tagline-wrapper {
		height: 80px;
		overflow: hidden;
	}

	.tagline {
		line-height: 1.618;
		font-size: 150%;
		font-weight: 500;
		max-width: 480px;
		margin: 0 auto;
	}

	.button-wrap {
	}

	.button {
		padding: 12px 26px;
		border-radius: var(--base-radius);
		font-weight: 700;
		color: var(--green-dark);
		background-color: var(--green);
		display: inline-block;
	}
	.button:hover {
		background-color: var(--green-dim);
	}

	.volume .label {
		color: var(--sonic-silver);
		margin-top: 8px;
		font-size: 90%;
	}

	.volume .value {
		font-weight: 700;
	}

	.chains {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.chains :global(svg) {
		height: 22px;
		margin-right: 4px;
		margin-left: 8px;
	}

	.sep {
		height: 2px;
		background-color: var(--onyx-dim);
		width: 60px;
		margin: 0 auto;
	}

	.links {
		padding-top: 64px;
		text-align: center;
		line-height: 1.618;
	}
	.links.bt {
		padding-top: 36px;
	}
	.links a {
		margin: 0 8px;
	}
	.links :global(svg) {
		height: 11px;
		fill: currentColor;
	}

	.description {
		padding-top: 36px;
		text-align: center;
		line-height: 1.618;
		color: var(--sonic-silver);
	}

	.community {
		padding-top: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.community a {
		margin: 0 10px;
	}

	.community :global(svg) {
		height: 22px;
		fill: currentColor;
	}

</style>

<div class='home-wrap'>

	<div class='home' in:blur={{duration: 1000, easing: quartOut}}>

		<div class='hero'>

			<div class='hero-inner'>

				<div class='main-title'>
					<img src='/logos/CAP.svg' title='CAP logo' alt='CAP logo' />
				</div>
				
				<div class='tagline-wrapper'>
					<div class='tagline'>Trade cryptos with up to 50× leverage directly from your wallet.</div>
				</div>

				<div class='button-wrap'>
					<a class='button' href='#/trade'>Start Trading</a>
				</div>

				<div class='volume'>
					<div class='value'><Volume/></div>
					<div class='label'>Protocol Volume</div>
				</div>

				<div class='chains'>Available on {@html ARBITRUM_ICON} Arbitrum</div>

			</div>

		</div>

		<div class='sep'></div>

		<div class='links'>
			<a href='#/trade'>Trade</a>
			<a href='#/pool'>Pool</a>
			<a href='https://docs.cap.finance' target='_blank'>Docs</a>
		</div>

		<div class='description'>CAP is an open protocol to trade perpetuals.</div>
		
		<div class='community'>
			<a href='https://discord.gg/zkdr8vnujz' target='_blank' title='Discord'>{@html DISCORD_ICON}</a>
			<a href='https://t.me/capfin' target='_blank' title='Telegram'>{@html TELEGRAM_ICON}</a>
			<a href='https://twitter.com/CapDotFinance' target='_blank' title='Twitter'>{@html TWITTER_ICON}</a>
			<a href='https://github.com/0xcap' target='_blank' title='Github'>{@html GITHUB_ICON}</a>
		</div>

		<div class='links bt'>
			<a href='https://www.tokenterminal.com/terminal/projects/cap' target='_blank'>Token Terminal</a>
			<a href='https://defillama.com/protocol/cap' target='_blank'>Defi Llama</a>
			<a href='https://www.immunefi.com/bounty/cap' target='_blank'>Immunefi</a>
			<a href='https://www.coingecko.com/en/coins/cap' target='_blank'>CoinGecko</a>
			<a href='https://coinmarketcap.com/currencies/cap/' target='_blank'>CoinMarketCap</a>
		</div>

	</div>

</div>