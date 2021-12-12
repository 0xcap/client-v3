<script>
	import Volume from '../Volume.svelte'

	import { EXTERNAL_ICON } from '../../lib/icons'

</script>
<style>

	.home-wrap {
		padding: var(--base-padding);
		background-color: var(--eerie-black);
		padding-bottom: 100px;
	}

	.home {
		margin: 0 auto;
		max-width: 800px;
		padding: 48px 0;
	}

	.hero {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 64px 0;
		border-bottom: 2px dotted var(--jet);
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

	.tagline {
		line-height: 1.618;
		font-size: 140%;
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
	}

	.volume .value {
		font-weight: 700;
	}

	.benefits-wrap {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-auto-flow: column;
		grid-gap: 36px;
		padding: 36px 0;
		border-bottom: 2px dotted var(--jet);
	}

	@media (max-width: 900px) {

		.benefits-wrap {
			grid-auto-flow: row;
			grid-template-columns: unset;
		}

	}

	.benefits {
	}

	.benefits-title {
		color: var(--green);
		font-weight: 700;
		font-size: 120%;
		margin-bottom: 10px;
	}

	.description {
		line-height: 1.618;
	}

	.community {
		padding: 36px 0 0;
		text-align: center;
		line-height: 1.618;
		color: var(--sonic-silver);
		max-width: 600px;
		margin: 0 auto;
	}

	.links {
		padding-top: 36px;
		text-align: center;
		line-height: 1.618;
	}

	.links :global(svg) {
		height: 11px;
		fill: currentColor;
	}

	.links a {
		margin: 0 8px;
	}

</style>

<div class='home-wrap'>

	<div class='home'>

		<div class='hero'>

			<div class='hero-inner'>

				<div class='main-title'>
					<img src='/logos/CAP.svg' title='CAP logo' alt='CAP logo' />
				</div>
					
				<div class='tagline'>Trade cryptos with up to 50× leverage directly from your wallet</div>

				<div class='button-wrap'>
					<a class='button' href='#/trade'>Start Trading</a>
				</div>

				<div class='volume'>
					<div class='value'><Volume/></div>
					<div class='label'>Protocol Volume</div>
				</div>

			</div>

		</div>

		<div class='links'>
			<a href='#/trade'>Trade</a>
			<a href='#/pool'>Pool</a>
			<a href='https://docs.cap.finance' target='_blank'>Docs</a>
		</div>

		<div class='community'>CAP is a decentralized perpetual exchange that is fast, cheap, and secure. Join the community on <a href='https://discord.gg/zkdr8vnujz' target='_blank'>Discord</a>, <a href='https://t.me/capfin' target='_blank'>Telegram</a>, and <a href='https://twitter.com/CapDotFinance' target='_blank'>Twitter</a>.</div>
		
		<div class='links'>
			<a href='https://www.tokenterminal.com/terminal/projects/cap' target='_blank'>Token Terminal</a>
			<a href='https://defillama.com/protocol/cap' target='_blank'>Defi Llama</a>
			<a href='https://www.immunefi.com/bounty/cap' target='_blank'>Immunefi</a>
			<a href='https://www.coingecko.com/en/coins/cap' target='_blank'>CoinGecko</a>
			<a href='https://coinmarketcap.com/currencies/cap/' target='_blank'>CoinMarketCap</a>
		</div>

	</div>

</div>