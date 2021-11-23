<script>

	import { CURRENCY_LOGOS } from '../lib/constants'

	import { SPINNER_ICON } from '../lib/icons'

	import { pools, allowances } from '../lib/stores'

	import { getAllowance, collectPoolReward, approveCurrency, getPoolInfo } from '../lib/methods'

	import { showModal, formatCurrency, formatToDisplay } from '../lib/utils'

	async function _approveCurrency(_currencyLabel) {
		const result = await approveCurrency(_currencyLabel, 'pool' + _currencyLabel);
	}

	async function getAllowances(_pools) {
		if (!_pools) return;
		for (const _currencyLabel in _pools) {
			await getAllowance(_currencyLabel, 'pool' + _currencyLabel);
		}
	}

	$: getAllowances($pools);

	let poolIsLoading = {};

	async function reloadPoolInfo(_currencyLabel) {
		poolIsLoading[_currencyLabel] = true;
		await getPoolInfo(_currencyLabel);
		poolIsLoading[_currencyLabel] = false;
	}

	let poolEntries = [];
	$: poolEntries = Object.entries($pools).sort((a,b) => {return a[0] > b[0] ? -1 : 1});

</script>

<style>

	.pools {
		max-width: 720px;
		margin: 0 auto;
	}

	.columns {
		padding: 0 var(--base-padding);
		color: var(--sonic-silver);
		font-size: 90%;
	}

	.pool {
		background-color: var(--eerie-black);
		margin-bottom: var(--base-padding);
		border-radius: var(--base-radius);
		overflow: hidden;
	}

	.column {

	}

	.flex {
		display: flex;
		align-items: center;
	}

	.columns, .info, .row {
		display: flex;
		align-items: center;
		height: 54px;
	}

	.info {
		padding: 0 var(--base-padding);
	}
	.info .column-asset {
		font-weight: 700;
	}

	.column-asset {
		flex: 1;
	}

	.column-asset img {
		width: 24px;
		margin-right: 10px;
	}

	.column-apr {
		flex: 1.5;
		text-align: right;
		margin-right: 10px;
	}

	.column-tvl {
		flex: 1.5;
		text-align: right;
	}

	.description {
		padding: var(--base-padding);
		background-color: var(--eerie-black);
		padding-top: 0;
		line-height: 1.618;
		font-size: 80%;
		color: var(--sonic-silver);
	}

	.my-share {
		padding: 0 var(--base-padding);
		background-color: var(--jet-dim);
	}

	.label {
		color: var(--sonic-silver);
	}

	.sub-label {
		font-size: 80%;
		opacity: 0.75;
	}

	.sep {
		color: var(--dim-gray);
		margin: 0 4px;
		font-size: 85%;
	}

	.loading {
		opacity: 1;
		pointer-events: none;
	}

	a.disabled {
		pointer-events: none;
		color: var(--dim-gray);
	}

	.reload {
		margin-left: 10px;
		font-size: 85%;
		color: var(--sonic-silver);
		cursor: pointer;
	}
	.reload:hover {
		color: #fff;
	}

	.loading-icon :global(svg) {
		height: 24px;
	}

</style>

<div class='pools'>

	<div class='columns'>

		<div class='column column-asset'>Asset</div>
		<div class='column column-apr'></div>
		<div class='column column-tvl'>TVL</div>

	</div>

	{#each poolEntries as [_currencyLabel, poolInfo]}
		<div class='pool' class:loading={poolIsLoading[_currencyLabel] || !poolInfo.tvl}>

			<div class='info'>
				<div class='column column-asset flex'>
					<img src={CURRENCY_LOGOS[_currencyLabel]}>
					{formatCurrency(_currencyLabel)} 
					<div title='Reload' class='reload' on:click={() => {reloadPoolInfo(_currencyLabel)}}>&#8635;</div>
				</div>
				<div class='column column-apr'></div>
				<div class='column column-tvl'>
					{#if poolInfo.tvl}
						{formatToDisplay(poolInfo.tvl)}
					{:else}
						<div class='loading-icon'>{@html SPINNER_ICON}</div>
					{/if}
				</div>
			</div>

			<div class='description'>
				This pool backs trader profits and receives trader losses plus <strong>{formatToDisplay(poolInfo.poolShare)}%</strong> of {formatCurrency(_currencyLabel)} fees as rewards.<br/>
				Open interest: {formatToDisplay(poolInfo.openInterest)} {formatCurrency(_currencyLabel)} / {formatToDisplay(poolInfo.tvl / (poolInfo.utilizationMultiplier/100))} {formatCurrency(_currencyLabel)} ({formatToDisplay(poolInfo.utilization)}% utilization)
			</div>

			<div class='my-share'>

				<div class='row'>
					<div class='column column-asset label'>My Share</div>
					<div class='column column-apr'>{formatToDisplay(poolInfo.userBalance) || 0} {formatCurrency(_currencyLabel)} ({formatToDisplay(poolInfo.tvl*1 == 0 ? 0 : 100*poolInfo.userBalance/poolInfo.tvl)}%)</div>
					<div class='column column-tvl'>
						{#if $allowances[_currencyLabel] && $allowances[_currencyLabel]['pool' + _currencyLabel] * 1 == 0}
							<a on:click={() => {_approveCurrency(_currencyLabel)}}>Approve {formatCurrency(_currencyLabel)}</a>
						{:else}
						<a data-intercept="true" on:click={() => {showModal('PoolDeposit', {currencyLabel: _currencyLabel})}}>Deposit</a><span class='sep'>|</span><a class:disabled={poolInfo.userBalance == 0} data-intercept="true" on:click={() => {showModal('PoolWithdraw', {currencyLabel: _currencyLabel, withdrawFee: poolInfo.withdrawFee})}}>Withdraw</a>
						{/if}
					</div>
				</div>

				<div class='row'>
					<div class='column column-asset label'>My Rewards</div>
					<div class='column column-apr'>{formatToDisplay(poolInfo.claimableReward) || 0} {formatCurrency(_currencyLabel)}</div>
					<div class='column column-tvl'>
						<a class:disabled={poolInfo.claimableReward == 0} on:click={() => {collectPoolReward(_currencyLabel)}}>Collect</a>
					</div>
				</div>

			</div>

		</div>
    {/each}

</div>