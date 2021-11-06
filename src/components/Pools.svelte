<script>

	import { pools, capPool, allowances } from '../lib/stores'

	import { getAllowance, collectPoolReward, collectCAPReward, approveCurrency, getPoolShare } from '../lib/methods'

	import { showModal, formatCurrency, formatToDisplay } from '../lib/utils'

	async function _approveCurrency(_currencyLabel) {
		const result = await approveCurrency(_currencyLabel, _currencyLabel == 'cap' ? 'capPool' : 'pool' + _currencyLabel);
	}

	async function getAllowances(_pools) {
		if (!_pools) return;
		for (const _currencyLabel in _pools) {
			await getAllowance(_currencyLabel, 'pool' + _currencyLabel);
		}
		await getAllowance('cap', 'capPool');
	}

	$: getAllowances($pools);

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

	.column-apr {
		flex: 1;
		text-align: right;
		margin-right: 10px;
	}

	.column-tvl {
		flex: 1;
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
	}

</style>

<div class='pools'>

	<div class='columns'>

		<div class='column column-asset'>Asset</div>
		<div class='column column-apr'></div>
		<div class='column column-tvl'>TVL</div>

	</div>

	{#each Object.entries($pools) as [_currencyLabel, poolInfo]}
		<div class='pool'>

			<div class='info'>
				<div class='column column-asset'>{formatCurrency(_currencyLabel)}</div>
				<div class='column column-apr'></div>
				<div class='column column-tvl'>{formatToDisplay(poolInfo.tvl) || 0}</div>
			</div>

			<div class='description'>This pool backs trader profits and receives trader losses plus <strong>{formatToDisplay(poolInfo.poolShare)}%</strong> of {formatCurrency(_currencyLabel)} fees as rewards.</div>

			<div class='my-share'>

				<div class='row'>
					<div class='column column-asset label'>My Share</div>
					<div class='column column-apr'>{formatToDisplay(poolInfo.userBalance) || 0} {formatCurrency(_currencyLabel)} ({formatToDisplay(poolInfo.tvl*1 == 0 ? 0 : 100*poolInfo.userBalance/poolInfo.tvl)}%)</div>
					<div class='column column-tvl'>
						{#if $allowances[_currencyLabel] && $allowances[_currencyLabel]['pool' + _currencyLabel] * 1 == 0}
							<a on:click={() => {_approveCurrency(_currencyLabel)}}>Approve {formatCurrency(_currencyLabel)}</a>
						{:else}
						<a data-intercept="true" on:click={() => {showModal('PoolDeposit', {currencyLabel: _currencyLabel})}}>Deposit</a><span class='sep'>|</span><a data-intercept="true" on:click={() => {showModal('PoolWithdraw', {currencyLabel: _currencyLabel})}}>Withdraw</a>
						{/if}
					</div>
				</div>

				<div class='row'>
					<div class='column column-asset label'>My Rewards</div>
					<div class='column column-apr'>{formatToDisplay(poolInfo.claimableReward) || 0} {formatCurrency(_currencyLabel)}</div>
					<div class='column column-tvl'>
						<a on:click={() => {collectPoolReward(_currencyLabel)}}>Collect</a>
					</div>
				</div>

			</div>

		</div>
    {/each}

    <div class='pool'>

    	<div class='info'>
    		<div class='column column-asset'>CAP</div>
    		<div class='column column-apr'></div>
    		<div class='column column-tvl'>{$capPool.supply}</div>
    	</div>

    	<div class='description'>This pool receives trading fees as rewards.</div>

    	<div class='my-share'>

    		<div class='row'>
    			<div class='column column-asset label'>My Share</div>
    			<div class='column column-apr'>{formatToDisplay($capPool.userBalance)} ({formatToDisplay($capPool.supply*1 == 0 ? 0 : 100*$capPool.userBalance/$capPool.supply)}%)</div>
    			<div class='column column-tvl'>
    				{#if $allowances['cap'] && $allowances['cap']['capPool'] * 1 == 0}
    					<a on:click={() => {_approveCurrency('cap')}}>Approve CAP</a>
    				{:else}
    					<a data-intercept="true" on:click={() => {showModal('PoolDeposit', {currencyLabel: 'cap'})}}>Deposit</a><span class='sep'>|</span><a data-intercept="true" on:click={() => {showModal('PoolWithdraw', {currencyLabel: 'cap'})}}>Withdraw</a>
    				{/if}
    			</div>
    		</div>

    		{#each Object.entries($capPool.claimableRewards || {}) as [_currencyLabel, reward]}

    			<div class='row'>
    				<div class='column column-asset label'>My {formatCurrency(_currencyLabel)} Rewards
    					<div class='sub-label'>Receives <strong>{formatToDisplay($capPool.poolShares[_currencyLabel])}%</strong> of fees</div>
    				</div>
    				<div class='column column-apr'>{formatToDisplay(reward)}</div>
    				<div class='column column-tvl'>
    					<a on:click={() => {collectCAPReward(_currencyLabel)}}>Collect</a>
    				</div>
    			</div>

    		{/each}

    	</div>

    </div>

</div>