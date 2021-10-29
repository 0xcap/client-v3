<script>

	import { pools, capPool, allowances } from '../lib/stores'

	import { getAllowance, collectPoolReward, collectCAPReward, approveCurrency } from '../lib/methods'

	import { showModal } from '../lib/utils'

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

	.position {
		display: flex;
	}

	.column {

	}

	.column-asset {
		width: 15%;
	}

	.column-apr {
		flex: 1;
		text-align: right;
	}

	.column-tvl {
		flex: 1;
		text-align: right;
	}

</style>

<div class='pools'>

	<div class='columns'>

		<div class='column column-asset'>Asset</div>
		<div class='column column-apr'>APR</div>
		<div class='column column-tvl'>TVL</div>

	</div>

	{#each Object.entries($pools) as [_currencyLabel, poolInfo]}
		<div class='pool'>

			<div class='info'>
				<div class='column column-asset'>{_currencyLabel}</div>
				<div class='column column-apr'>100%+</div>
				<div class='column column-tvl'>{poolInfo.tvl}</div>
			</div>

			<div class='my-share'>

				<div class='row'>
					<div class='label'>My Share</div>
					<div class='value'>{poolInfo.userShare} {_currencyLabel} ({100*poolInfo.stakedBalance/poolInfo.clpSupply}%)</div>
					<div class='tools'>
						{#if $allowances[_currencyLabel] && $allowances[_currencyLabel]['pool' + _currencyLabel] * 1 == 0}
							<a on:click={() => {_approveCurrency(_currencyLabel)}}>Approve</a>
						{:else}
						<a data-intercept="true" on:click={() => {showModal('PoolDeposit', {currencyLabel: _currencyLabel})}}>Deposit</a> | <a data-intercept="true" on:click={() => {showModal('PoolWithdraw', {currencyLabel: _currencyLabel})}}>Withdraw</a>
						{/if}
					</div>
				</div>

				<div class='row'>
					<div class='label'>My Rewards</div>
					<div class='value'>{poolInfo.claimableReward} {_currencyLabel}</div>
					<div class='tools'>
						<a on:click={() => {collectPoolReward(_currencyLabel)}}>Collect rewards</a>
					</div>
				</div>

			</div>

		</div>
    {/each}


    <h2>Cap Staking</h2>

    <div class='pool'>

    	<div class='info'>
    		<div class='column column-asset'>CAP</div>
    		<div class='column column-apr'>100%+</div>
    		<div class='column column-tvl'>{$capPool.stakedSupply}</div>
    	</div>

    	<div class='my-share'>

    		<div class='row'>
    			<div class='label'>My Share</div>
    			<div class='value'>{$capPool.stakedBalance}</div>
    			<div class='tools'>
    				{#if $allowances['cap'] && $allowances['cap']['capPool'] * 1 == 0}
    					<a on:click={() => {_approveCurrency('cap')}}>Approve</a>
    				{:else}
    					<a data-intercept="true" on:click={() => {showModal('PoolDeposit', {currencyLabel: 'cap'})}}>Deposit</a> | <a data-intercept="true" on:click={() => {showModal('PoolWithdraw', {currencyLabel: _currencyLabel})}}>Withdraw</a>
    				{/if}
    			</div>
    		</div>

    		<h3>My rewards</h3>

    		{#each Object.entries($capPool.claimableRewards || {}) as [_currencyLabel, reward]}

    			<div class='row'>
    				<div class='label'>{_currencyLabel}</div>
    				<div class='value'>{reward}</div>
    				<div class='tools'>
    					<a on:click={() => {collectCAPReward(_currencyLabel)}}>Collect rewards</a>
    				</div>
    			</div>

    		{/each}

    		

    	</div>

    </div>

</div>