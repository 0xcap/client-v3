<script>
	import Volume from '../Volume.svelte'

</script>
<style>

	.home-wrap {
		padding: var(--base-padding);
		background-color: var(--eerie-black);
		border-top: 1px solid var(--jet);
		padding-bottom: 100px;
	}

	.home {
		margin: 0 auto;
		max-width: 1260px;
	}

	.hero {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 64px 0;
		border-bottom: 1px solid var(--jet);
	}

	.hero-inner {		
		display: grid;
		grid-auto-flow: row;
		grid-gap: 24px;
		text-align: center;
	}

	.main-title {
		color: var(--green);
		font-weight: 700;
		font-size: 200%;
	}

	.tagline {
	}

	.button-wrap {
	}

	.button {
		padding: 12px var(--base-padding);
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

	.benefits-wrap {
		display: grid;
		grid-auto-flow: column;
		grid-gap: 48px;
		padding: 36px 0;
	}

	@media (max-width: 900px) {

		.benefits-wrap {
			grid-auto-flow: row;
		}

	}

	.benefits {
	}

	.benefits-title {
		color: var(--green);
		font-weight: 700;
		font-size: 120%;
		margin-bottom: var(--base-padding);
	}

	.item {
		margin-bottom: var(--base-padding);
	}

	.item .title {
		font-weight: 700;
		margin-bottom: 4px;
	}

	.item .description {
		line-height: 1.418;
		color: var(--sonic-silver);
	}

	.community {
		padding-top: 36px;
		text-align: center;
		line-height: 1.618;
	}

</style>

<div class='home-wrap'>

	<div class='home'>

		<div class='hero'>

			<div class='hero-inner'>

				<div class='main-title'>Cap</div>
					
				<div class='tagline'>Decentralized Trading Protocol</div>
				
				<div class='button-wrap'>
					<a class='button' href='#/trade'>Trade</a>
				</div>

				<div class='volume'>
					<div class='value'><Volume/></div>
					<div class='label'>Protocol Volume</div>
				</div>

			</div>

		</div>

		<div class='benefits-wrap'>

			<div class='benefits'>

				<div class='benefits-title'><a href='/#/trade'>Trade</a></div>

				<div class='item'>
					<div class='title'>Permissionless</div>
					<div class='description'>Trade directly from your wallet, no account needed.</div>
				</div>

				<div class='item'>
					<div class='title'>Fast</div>
					<div class='description'>Trades are executed and settled in seconds.</div>
				</div>

				<div class='item'>
					<div class='title'>Leverage</div>
					<div class='description'>Adjust leverage from none to 50x on each trade.</div>
				</div>

			</div>

			<div class='benefits'>

				<div class='benefits-title'><a href='/#/pool'>Pool</a></div>

				<div class='item'>
					<div class='title'>Liquidity</div>
					<div class='description'>Pools pay out trader profits and in exchange receive their losses.</div>
				</div>

				<div class='item'>
					<div class='title'>Rewards</div>
					<div class='description'>Get fee rewards directly in ETH and USDC.</div>
				</div>

				<div class='item'>
					<div class='title'>Flexible</div>
					<div class='description'>Deposit and withdraw without time constraints.</div>
				</div>

			</div>

			<div class='benefits'>

				<div class='benefits-title'><a href='/#/stake'>Stake</a></div>

				<div class='item'>
					<div class='title'>Passive Income</div>
					<div class='description'>Stake CAP to receive a share of protocol fees.</div>
				</div>

				<div class='item'>
					<div class='title'>No Inflation</div>
					<div class='description'>CAP's supply is fixed at 100,000.</div>
				</div>

				<div class='item'>
					<div class='title'>Participate</div>
					<div class='description'>Join other CAP holders in deciding the protocol's future.</div>
				</div>

			</div>

		</div>

		<div class='community'>Cap is a community-funded project. Join us on <a href='https://t.me/capfin' target='_blank'>Telegram</a> and <a href='https://twitter.com/CapDotFinance' target='_blank'>Twitter</a>.</div>

	</div>

</div>