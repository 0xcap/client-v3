<script>
	import Volume from '../Volume.svelte'

</script>
<style>

	.home {
		background-color: var(--eerie-black);
		padding: var(--base-padding);
		display: grid;
		grid-auto-flow: row;
		grid-gap: 48px;
	}

	.hero {
		display: grid;
		grid-auto-flow: row;
		grid-gap: 22px;
	}

	.volume .label {
		color: var(--sonic-silver);
		margin-top: 8px;
		font-size: 90%;
	}

	.volume .value {
		font-weight: 700;
	}

	.button {
		padding: 8px var(--base-padding);
		border-radius: var(--base-radius);
		font-weight: 700;
		color: var(--green-dark);
		background-color: var(--green);
		display: inline-block;
		margin-right: 10px;
	}

	.button svg {
		height: 26px;
	}

	.benefits {
		display: grid;
		grid-auto-flow: row;
		grid-gap: 16px;
	}

	.benefits-title {
		color: var(--green);
		font-weight: 700;
		font-size: 120%;
	}

	.item .title {
		font-weight: 700;
		margin-bottom: 8px;
	}

</style>

<div class='home'>

	<div class='hero'>

		<div class='benefits-title'>Cap</div>
			
		<div class='tagline'>Fast and cheap decentralized trading.</div>
		
		<div class='button-wrap'>
			<a class='button' href='#/trade'>Trade</a>
		</div>

		<div class='volume'>
			<div class='value'><Volume/></div>
			<div class='label'>Protocol Volume</div>
		</div>

	</div>

	<div class='benefits'>

		<div class='benefits-title'>For Traders</div>

		<div class='item'>
			<div class='title'>Fast</div>
			<div class='description'>Trades are executed and confirmed in seconds.</div>
		</div>

		<div class='item'>
			<div class='title'>Permissionless</div>
			<div class='description'>Trade directly from your wallet — no account needed.</div>
		</div>

		<div class='item'>
			<div class='title'>Leverage</div>
			<div class='description'>Adjust leverage from 1x to 50x on each trade.</div>
		</div>

	</div>

	<div class='benefits'>

		<div class='benefits-title'>For Liquidity Providers</div>

		<div class='item'>
			<div class='title'>Sustainable APR</div>
			<div class='description'>Pool funds to back trader profits and receive their losses.</div>
		</div>

		<div class='item'>
			<div class='title'>Rewards</div>
			<div class='description'>Get fee rewards directly in ETH and USDC, not inflation tokens.</div>
		</div>

		<div class='item'>
			<div class='title'>Flexible</div>
			<div class='description'>Deposit and withdraw without time constraints.</div>
		</div>

		<div class='button-wrap'>
			<a class='button' href='#/pool'>Pool</a>
		</div>

	</div>

	<div class='benefits'>

		<div class='benefits-title'>For CAP Holders</div>

		<div class='item'>
			<div class='title'>Passive Income</div>
			<div class='description'>Receive a share of protocol fees as rewards.</div>
		</div>

		<div class='item'>
			<div class='title'>Fixed Supply</div>
			<div class='description'>CAP's supply is fixed at 100,000 with no inflation.</div>
		</div>

		<div class='item'>
			<div class='title'>Participate</div>
			<div class='description'>Join other CAP holders in deciding the protocol's future.</div>
		</div>

		<div class='button-wrap'>
			<a class='button' href='https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x43044f861ec040db59a7e324c40507addb673142'>Buy CAP (Ethereum)</a>
			<a class='button' href='https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x031d35296154279dc1984dcd93e392b1f946737b'>Buy CAP (Arbitrum)</a>
		</div>

	</div>

	<div class='community'>Cap is a community-funded project. Find us on <a href='https://t.me/capfin' target='_blank'>Telegram</a> and <a href='https://twitter.com/CapDotFinance' target='_blank'>Twitter</a>.</div>

</div>