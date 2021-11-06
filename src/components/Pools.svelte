<script>

	import { pools, capPool, allowances } from '../lib/stores'

	import { getAllowance, collectPoolReward, collectCAPReward, approveCurrency } from '../lib/methods'

	import { showModal, formatCurrency, formatToDisplay } from '../lib/utils'

	async function _approveCurrency(_currencyLabel) {
		const result = await approveCurrency(_currencyLabel, _currencyLabel == 'cap' ? 'capPool' : 'pool' + _currencyLabel);
	}

	$: console.log('$allowances', $allowances);

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
		max-width: 660px;
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
	}

	.column-tvl {
		flex: 1;
		text-align: right;
	}

	.my-share {
		padding: 0 var(--base-padding);
		background-color: var(--jet-dim);
	}

	.label {
		color: var(--sonic-silver);
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

			<div class='my-share'>

				<div class='row'>
					<div class='column-asset label'>My Share</div>
					<div class='column-apr'>{formatToDisplay(poolInfo.userBalance) || 0} {formatCurrency(_currencyLabel)} ({formatToDisplay(poolInfo.tvl*1 == 0 ? 0 : 100*poolInfo.userBalance/poolInfo.tvl)}%)</div>
					<div class='column-tvl'>
						{#if $allowances[_currencyLabel] && $allowances[_currencyLabel]['pool' + _currencyLabel] * 1 == 0}
							<a on:click={() => {_approveCurrency(_currencyLabel)}}>Approve {formatCurrency(_currencyLabel)}</a>
						{:else}
						<a data-intercept="true" on:click={() => {showModal('PoolDeposit', {currencyLabel: _currencyLabel})}}>Deposit</a>, <a data-intercept="true" on:click={() => {showModal('PoolWithdraw', {currencyLabel: _currencyLabel})}}>Withdraw</a>
						{/if}
					</div>
				</div>

				<div class='row'>
					<div class='column-asset label'>My Rewards</div>
					<div class='column-apr'>{formatToDisplay(poolInfo.claimableReward) || 0} {formatCurrency(_currencyLabel)}</div>
					<div class='column-tvl'>
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

    	<div class='my-share'>

    		<div class='row'>
    			<div class='column-asset label'>My Share</div>
    			<div class='column-apr'>{formatToDisplay($capPool.userBalance)} ({formatToDisplay($capPool.supply*1 == 0 ? 0 : 100*$capPool.userBalance/$capPool.supply)}%)</div>
    			<div class='column-tvl'>
    				{#if $allowances['cap'] && $allowances['cap']['capPool'] * 1 == 0}
    					<a on:click={() => {_approveCurrency('cap')}}>Approve CAP</a>
    				{:else}
    					<a data-intercept="true" on:click={() => {showModal('PoolDeposit', {currencyLabel: 'cap'})}}>Deposit</a>, <a data-intercept="true" on:click={() => {showModal('PoolWithdraw', {currencyLabel: 'cap'})}}>Withdraw</a>
    				{/if}
    			</div>
    		</div>

    		{#each Object.entries($capPool.claimableRewards || {}) as [_currencyLabel, reward]}

    			<div class='row'>
    				<div class='column-asset label'>{formatCurrency(_currencyLabel)} Rewards</div>
    				<div class='column-apr'>{formatToDisplay(reward)}</div>
    				<div class='column-tvl'>
    					<a on:click={() => {collectCAPReward(_currencyLabel)}}>Collect</a>
    				</div>
    			</div>

    		{/each}

    	</div>

    </div>

</div>