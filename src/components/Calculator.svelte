<script>
	// initial values for calculator
	let protocolFees = 1000000;
	let pctStakerFees = 30;
	let totalCapStaked = 70000;
	let yourCapStaked = 10;
	let rewardPerCap;

	$: if (totalCapStaked === 0) {
		rewardPerCap = 0;
	} else {
		rewardPerCap = protocolFees * (pctStakerFees / 100.0) / totalCapStaked;
	}
	$: rewardTotal = rewardPerCap * yourCapStaked;

	function formatUsd(value) {
		return `$${value === 0 ? "-" : value.toFixed(2)}`;
	}
</script>

<style>
.calculator-page {
	max-width: 720px;
	margin: 0 auto;
}

.calculator {
	background-color: var(--eerie-black);
	border-radius: var(--base-radius);
}

.row {
	display: flex;
	align-items: center;
	min-height: 54px;
}

.info {
	padding: 0 var(--base-padding);
	font-weight: 700;
}

.description {
	padding: var(--base-padding);
	background-color: var(--eerie-black);
	padding-top: 0;
	margin-bottom: 0;
	line-height: 1.618;
	font-size: 0.8rem;
	color: var(--sonic-silver);
}

.results,
.entries {
	padding: var(--base-padding);
	background-color: var(--jet-dim);
}

.results .description {
	padding-right: 0;
	background-color: var(--jet-dim);
}

.reward {
	text-align: right;
}

.hero {
	font-size: 96px;
	color: var(--dim-gray);
	line-height: 1;
	margin-top: 48px;
	margin-bottom: 0;
}

.gains {
	color: var(--green-dim);
}

.entries .row {
	align-items: stretch;
	text-align: right;
}

legend {
	text-align: left;
	color: var(--sonic-silver);
}

fieldset {
	width: 50%;
	border: none;
}
fieldset>div {
	padding-bottom: 5px;
}
input {
	border: 1px solid var(--dim-gray);
	width: 100%;
	text-align: right;
	background-color: var(--onyx-dim);
	border-color: var(--onyx-dim);
	border-radius: var(--base-radius);
}
input:hover, input:focus {
	border-color: var(--green-dark);
}
input[type=range] {
	accent-color: var(--green-dark);
}
</style>

<div class="calculator-page">
	<div class="calculator">
		<div class="info row">
			<div><header>Staking Rewards</header></div>
		</div>
		<div class="description">
			Estimate your monthly rewards from staking CAP
		</div>
		<div class="results">
			<div class="reward">
				<div class="hero" class:gains={rewardTotal > 0}>{formatUsd(rewardTotal)}</div>
				<div class="description">Your Total Monthly CAP Rewards</div>
			</div>
			<div class="reward">
				<div class="hero" class:gains={rewardPerCap > 0}>{formatUsd(rewardPerCap)}</div>
				<div class="description">Monthly Rewards per CAP token</div>
			</div>
		</div>
		<div class="entries">
			<div class="row">
				<fieldset title="Fees are generated when traders open or close positions, or when positions are liquidated.">
					<legend>Monthly Protocol Fees ($)</legend>
					<input type="number" bind:value={protocolFees} />
				</fieldset>
				<fieldset title="The number of CAP tokens that are currently staked and share in fee revenue.">
					<legend>Total CAP Staked</legend>
					<div>
						<input type="number" bind:value={totalCapStaked} min={yourCapStaked} max="100000" />
					</div>
					<div>
						<input type="range" bind:value={totalCapStaked} min={yourCapStaked} max="100000" />
					</div>
				</fieldset>
			</div>
			<div class="row">
				<fieldset title="The portion of trader fees that goes to CAP token stakers.">
					<legend>Fee to Stakers (%)</legend>
					<div>
						<input type="number" bind:value={pctStakerFees} min="0" max="100" />
					</div>
					<div>
						<input type="range" bind:value={pctStakerFees} min="0" max="100" />
					</div>
				</fieldset>
				<fieldset title="The number of CAP tokens you have staked.">
					<legend>Your Staked CAP</legend>
					<div>
						<input type="number" bind:value={yourCapStaked} min="0" max={Math.min(totalCapStaked, 3000)} />
					</div>
					<div>
						<input type="range" bind:value={yourCapStaked} min="0" max={Math.min(totalCapStaked, 3000)} />
					</div>
				</fieldset>
			</div>
		</div>
	</div>
</div>
