<script>
	import Volume from '../Volume.svelte'

	import { EXTERNAL_ICON, DISCORD_ICON, TWITTER_ICON, TELEGRAM_ICON, GITHUB_ICON, ARBITRUM_ICON, CHECKMARK_ICON } from '../../lib/icons'

	amplitude.getInstance().logEvent('Home');

</script>
<style>

	.home-wrap {
		padding: var(--base-padding);
		background-color: var(--eerie-black);
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
		padding: 36px 0;
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

	.tagline {
		line-height: 1.618;
		font-size: 160%;
		font-weight: 700;
		max-width: 500px;
		margin: 0 auto;
	}

	.subhead {
		line-height: 1.518;
		font-size: 120%;
		font-weight: 400;
		max-width: 360px;
		margin: 0 auto;
		color: var(--sonic-silver);
		margin-top: 12px;
	}

	.chains {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 90%;
		font-weight: 500;
	}
	.chains :global(svg) {
		height: 22px;
		margin-right: 4px;
		margin-left: 8px;
	}

	.button-wrap {
	}

	.button {
		padding: 16px 26px;
		border-radius: var(--base-radius);
		font-weight: 700;
		font-size: 120%;
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

	.about {
		max-width: 250px;
		margin: 0 auto;
		border-top: 1px solid var(--onyx-dim);
		border-bottom: 1px solid var(--onyx-dim);
		padding: 40px 0;
	}

	h4, p {
		padding: 0;
		margin: 0;
	}

	.item {
		margin-bottom: 20px;
	}
	.item:last-child {
		margin-bottom: 0;
	}

	h4 {
		margin-bottom: 6px;
	}
	h4 {
		display: flex;
		align-items: center;
	}
	h4 :global(svg) {
		height: 16px;
		fill: var(--green);
		margin-right: 10px;
	}
	p {
		line-height: 1.418;
		color: var(--sonic-silver);
	}

	.links {
		padding-top: 18px;
		text-align: center;
		line-height: 1.618;
	}
	.links a {
		margin: 0 8px;
		color: var(--sonic-silver);
		font-size: 90%;
	}
	.links a:hover {
		color: var(--green);
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
		height: 18px;
		fill: currentColor;
	}

</style>

<div class='home-wrap'>

	<div class='home'>

		<div class='hero'>

			<div class='hero-inner'>

				<div class='main-title'>
					<img src='/logos/CAP.svg' title='CAP logo' alt='CAP logo' />
				</div>
				
				<div>
					<div class='tagline'>Decentralized Perpetual Exchange</div>

					<div class='subhead'>Trade cryptos up to 50× leverage directly from your wallet</div>
				</div>

				<div class='button-wrap'>
					<a class='button' href='#/trade'>Trade →</a>
				</div>

				<div class='volume'>
					<div class='value'><Volume/></div>
					<div class='label'>Protocol Volume</div>
				</div>

			</div>

		</div>
		
		<div class='community'>
			<a href='https://discord.gg/zkdr8vnujz' target='_blank' title='Discord'>{@html DISCORD_ICON}</a>
			<a href='https://t.me/capfin' target='_blank' title='Telegram'>{@html TELEGRAM_ICON}</a>
			<a href='https://twitter.com/CapDotFinance' target='_blank' title='Twitter'>{@html TWITTER_ICON}</a>
			<a href='https://github.com/0xcap' target='_blank' title='Github'>{@html GITHUB_ICON}</a>
		</div>

		<div class='links'>
			<a href='#/buy'>Buy CAP</a>
			<a href='https://docs.cap.finance/#white-papers' target='_blank'>Whitepapers</a>
			<a href='https://docs.cap.finance/' target='_blank'>Docs</a>
			<a href='https://www.tokenterminal.com/terminal/projects/cap' target='_blank'>Token Terminal</a>
			<a href='https://defillama.com/protocol/cap' target='_blank'>Defi Llama</a>
			<a href='https://www.immunefi.com/bounty/cap' target='_blank'>Immunefi</a>
		</div>

	</div>

</div>