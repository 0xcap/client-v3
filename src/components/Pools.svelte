<script>

	import { CURRENCY_LOGOS } from '../lib/constants'

	import { SPINNER_ICON } from '../lib/icons'

	import { capPool, pools, oldPools, poolStats, allowances, prices, address } from '../lib/stores'

	import { getAllowance, collectPoolReward, approveCurrency, getPoolInfo, getOldPoolInfo, collectCAPReward } from '../lib/methods'

	import { showModal, formatCurrency, formatToDisplay, getChainData } from '../lib/utils'

	async function _approveCurrency(_currencyLabel) {
		if (_currencyLabel == 'cap') {
			const result = await approveCurrency('cap', 'capPool');
		} else {
			const result = await approveCurrency(_currencyLabel, 'pool' + _currencyLabel);
		}
	}

	async function getAllowances(_pools, _capPool) {
		if (!_pools) return;
		for (const _currencyLabel in _pools) {
			await getAllowance(_currencyLabel, 'pool' + _currencyLabel);
		}
		if (!_capPool || !_capPool.supply) return;
		await getAllowance('cap', 'capPool');
	}

	$: getAllowances($pools, $capPool);

	let poolIsLoading = {};

	async function reloadPoolInfo(_currencyLabel, isOld) {
		const label = isOld ? _currencyLabel + '-old' : _currencyLabel;
		poolIsLoading[label] = true;
		if (isOld) {
			await getOldPoolInfo(_currencyLabel);
		} else {
			await getPoolInfo(_currencyLabel, true);
		}
		poolIsLoading[label] = false;
	}

	let poolEntries = [];
	$: poolEntries = Object.entries($pools).sort((a,b) => {return a[0] > b[0] ? -1 : 1});

	let oldPoolEntries = [];
	$: oldPoolEntries = Object.entries($oldPools).sort((a,b) => {return a[0] > b[0] ? -1 : 1});

	let oldPoolsShown = false;
	function toggleOldPools() {
		if (!oldPoolsShown) {
			reloadPoolInfo('weth', true);
			reloadPoolInfo('usdc', true);
		}
		oldPoolsShown = !oldPoolsShown;
	}

	// getters

	function getAPY(_currencyLabel, poolInfo, _poolStats) {
		if (!_poolStats || !_poolStats[_currencyLabel] || !poolInfo || !poolInfo.tvl*1) return '--';
		const poolInception = getChainData('poolInception');
		if (!poolInception) return '--';
		const inceptionDate = poolInception[_currencyLabel];
		if (!inceptionDate) return '--';
		const timeSinceInception = Date.now() - inceptionDate;
		const timeInAYear = 365 * 24 * 3600 * 1000;
		const timeScaler = timeInAYear / timeSinceInception;
		let apy = timeScaler * 100 * (_poolStats[_currencyLabel].cumulativeFees * poolInfo.poolShare / 100 - 1 * _poolStats[_currencyLabel].cumulativePnl) / poolInfo.tvl;
		if (apy < 10) apy = 10; // threshold APY
		return formatToDisplay(apy) + '%';
		//return "100%+"; // until enough trades come in to display actual stats from previous versions
	}

	function getAPYCAP(_capPool, _poolStats) {
		if (!_poolStats || !_poolStats['weth'] || !_capPool || !_capPool.supply*1) return '--';
		const poolInception = getChainData('poolInception');
		if (!poolInception) return '--';
		const inceptionDate = poolInception['cap'];
		if (!inceptionDate) return '--';
		const timeSinceInception = Date.now() - inceptionDate;
		const timeInAYear = 365 * 24 * 3600 * 1000;
		const timeScaler = timeInAYear / timeSinceInception;

		const currencyLabels = Object.keys(_capPool.claimableRewards);

		// console.log('currencyLabels', currencyLabels);

		let cumulativeUSDFees = 0;
		let capUSDSupply = 30 * _capPool.supply; // assuming CAP price of 30

		// console.log('capUSDSupply', capUSDSupply);
		for (const _currencyLabel of currencyLabels) {
			if (_currencyLabel == 'weth') {
				// ETH
				cumulativeUSDFees += _poolStats[_currencyLabel].cumulativeFees * $prices['ETH-USD'] * 1;
			} else {
				// USDC
				cumulativeUSDFees += _poolStats[_currencyLabel].cumulativeFees * 1;
			}
		}

		// console.log('cumulativeUSDFees', cumulativeUSDFees);
		// console.log('timeScaler', timeScaler);
		
		return formatToDisplay(timeScaler * 100 * (cumulativeUSDFees * 0.1) / capUSDSupply) + '%';
	}

	function getTVL(_currencyLabel, poolInfo) {
		if (!poolInfo || !poolInfo.tvl) return '';
		return formatToDisplay(poolInfo.tvl);
	}

	function getInceptionDate(_currencyLabel, poolInfo) {
		const poolInception = getChainData('poolInception');
		if (!poolInception) return '--';
		const inceptionDate = poolInception[_currencyLabel];
		if (!inceptionDate) return '--';
		const d = new Date(inceptionDate).toDateString();
		return d.substring(4);
	}

	function getReturnSinceInception(_currencyLabel, poolInfo, _poolStats) {
		if (!_poolStats || !_poolStats[_currencyLabel]) return '';
		return formatToDisplay(_poolStats[_currencyLabel].cumulativeFees * poolInfo.poolShare / 100 - 1 * _poolStats[_currencyLabel].cumulativePnl);
	}

</script>

<style>

	.pools {
		padding: var(--base-padding);
		display: flex;
		justify-content: center;
	}

	.pool {
		background-color: var(--eerie-black);
		border-radius: var(--base-radius);
		max-width: 500px;
		overflow: hidden;
		margin-right: var(--base-padding);
	}

	@media (max-width: 960px) {
		.pools {
			flex-direction: column;
		}
		.pool {
			margin-right: 0;
			margin-bottom: var(--base-padding);
		}
	}

	.asset {
		display: flex;
		align-items: center;
		font-size: 160%;
		font-weight: 600;
		padding: var(--base-padding);
	}

	.asset img {
		width: 32px;
		margin-right: 10px;
	}

	.description {
		padding: var(--base-padding);
		background-color: var(--eerie-black);
		padding-top: 0;
		line-height: 1.618;
		color: var(--sonic-silver);
	}

	.apy {
		padding: var(--base-padding);
		border-bottom: 1px solid var(--rich-black);
	}

	.apy .label {
		margin-bottom: 6px;
	}

	.apy .value {
		font-size: 200%;
		font-weight: 600;
		text-align: left !important;
	}

	.stats {

	}

	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px var(--base-padding);
		border-bottom: 1px solid var(--jet);
	}
	.row:last-child {
		border-bottom: none;
	}

	.label {
		color: var(--sonic-silver);
	}

	.top-label {
		margin-bottom: 6px;
	}

	.sub-label {
		font-size: 80%;
		opacity: 0.75;
		margin-bottom: 6px;
	}

	.value {
		text-align: right;
	}

	.my-stats {
		border-top: 1px solid var(--rich-black);
		background-color: var(--jet-dim);
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

	.loading a, a.disabled {
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

	.loading-icon {
		margin-left: 10px;
	}

	.loading-icon :global(svg) {
		height: 24px;
		margin-bottom: -3px;
	}

	.grayed {
		color: var(--sonic-silver);
	}

	hr {
		margin-top: calc(2*var(--base-padding));
		border: 1px solid var(--jet);
	}

	h2, h4 {
		color: var(--sonic-silver);
	}

	.note {
		color: var(--red);
		padding: var(--base-padding);
	}

</style>

<div class='pools'>

	{#each poolEntries as [_currencyLabel, poolInfo]}

		<div class='pool' class:loading={poolIsLoading[_currencyLabel] || !poolInfo.tvl}>

			<div class='asset'>
				<img src={CURRENCY_LOGOS[_currencyLabel]}>
				{formatCurrency(_currencyLabel)} 
				{#if !poolInfo.tvl || poolIsLoading[_currencyLabel]}
					<div class='loading-icon'>{@html SPINNER_ICON}</div>
				{/if}
			</div>

			<div class='description'>
				This pool pays trader profits and receives their losses<!--  + <strong>{formatToDisplay(poolInfo.poolShare)}%</strong> of {formatCurrency(_currencyLabel)} fees as rewards -->.
			</div>

			<div class='apy'>
				<div class='label'>Historical Yield (APY)</div>
				<div class='value'>{getAPY(_currencyLabel, poolInfo, $poolStats)}</div>
			</div>

			<div class='stats'>
				<div class='row'>
					<div class='label'>Pool Size</div>
					<div class='value'>{getTVL(_currencyLabel, poolInfo, $address)} {formatCurrency(_currencyLabel)} {#if _currencyLabel == 'weth' && poolInfo && poolInfo.tvl && $prices['ETH-USD']}
						<!-- <span class='grayed'>(${formatToDisplay($prices['ETH-USD'] * poolInfo.tvl || 0)})</span> -->
						{/if}</div>
				</div>
				<!-- <div class='row'>
					<div class='label'>Return Since Inception ({getInceptionDate(_currencyLabel, poolInfo)})</div>
					<div class='value pos'>+{getReturnSinceInception(_currencyLabel, poolInfo, $poolStats)} {formatCurrency(_currencyLabel)}</div>
				</div> -->
				<!-- <div class='row'>
					<div class='label'>Open Interest</div>
					<div class='value'>{formatToDisplay(poolInfo.openInterest)} {formatCurrency(_currencyLabel)}</div>
				</div>
				<div class='row'>
					<div class='label'>Utilization</div>
					<div class='value'>{formatToDisplay(poolInfo.utilization)}%</div>
				</div> -->
			</div>

			<div class='stats my-stats'>
				<div class='row'>
					<div class='label'>
						<div class='top-label'>My Share</div>
						{#if $allowances[_currencyLabel] && $allowances[_currencyLabel]['pool' + _currencyLabel] * 1 == 0}
							<a on:click={() => {_approveCurrency(_currencyLabel)}}>Approve {formatCurrency(_currencyLabel)}</a>
						{:else}
						<a data-intercept="true" class:disabled={!poolInfo.tvl} on:click={() => {showModal('PoolDeposit', {currencyLabel: _currencyLabel})}}>Deposit</a><span class='sep'>|</span><a class:disabled={poolInfo.userBalance == 0} data-intercept="true" on:click={() => {showModal('PoolWithdraw', {currencyLabel: _currencyLabel, withdrawFee: poolInfo.withdrawFee, userBalance: poolInfo.userBalance })}}>Withdraw</a>
						{/if}
					</div>
					<div class='value'>{formatToDisplay(poolInfo.userBalance) || 0} {formatCurrency(_currencyLabel)} <span class='grayed'>({formatToDisplay(poolInfo.tvl*1 == 0 ? 0 : 100*poolInfo.userBalance/poolInfo.tvl)}%)</span></div>
				</div>
				<div class='row'>
					<div class='label'>
						<div class='top-label'>My Rewards</div>
						<a class:disabled={poolInfo.claimableReward == 0} on:click={() => {collectPoolReward(_currencyLabel)}}>Collect</a></div>
					<div class='value'>{formatToDisplay(poolInfo.claimableReward) || 0} {formatCurrency(_currencyLabel)} 
						{#if _currencyLabel == 'weth' && $prices['ETH-USD'] && poolInfo}
						<span class='grayed'>(${formatToDisplay($prices['ETH-USD'] * poolInfo.claimableReward || 0)})</span>
						{/if}
					</div>
				</div>
			</div>

		</div>
    {/each}

    <div class='pool cap-pool' class:loading={poolIsLoading['cap'] || !$capPool.supply}>

    	<div class='asset'>
    		<img src={CURRENCY_LOGOS['cap']}>
    		CAP
    		{#if !$capPool.supply || poolIsLoading['cap']}
    			<div class='loading-icon'>{@html SPINNER_ICON}</div>
    		{/if}
    	</div>

    	<div class='description'>
    		Stake CAP to receive a share of revenue. <a href='#/buy'>Buy CAP</a>
    	</div>

    	<div class='apy'>
			<div class='label'>Historical Yield (APY)</div>
			<div class='value'>{getAPYCAP($capPool, $poolStats, $prices)}</div>
		</div>

    	<div class='stats'>
    		<div class='row'>
    			<div class='label'>Pool Size</div>
    			<div class='value'>{formatToDisplay($capPool.supply)}</div>
    		</div>
    	</div>

    	<div class='stats my-stats'>

    		<div class='row'>
    			<div class='label'>
    				<div class='top-label'>My Share</div>
    				{#if $allowances['cap'] && $allowances['cap']['capPool'] * 1 == 0}
    					<a on:click={() => {_approveCurrency('cap')}}>Approve CAP</a>
    				{:else}
    				<a data-intercept="true" on:click={() => {showModal('PoolDeposit', {currencyLabel: 'cap'})}}>Deposit</a><span class='sep'>|</span><a class:disabled={$capPool.userBalance == 0} data-intercept="true" on:click={() => {showModal('PoolWithdraw', {currencyLabel: 'cap', userBalance: $capPool.userBalance })}}>Withdraw</a>
    				{/if}
    			</div>
    			<div class='value'>
    				{formatToDisplay($capPool.userBalance)} CAP <span class='grayed'>({formatToDisplay($capPool.supply*1 == 0 ? 0 : 100*$capPool.userBalance/$capPool.supply)}%)</span>
    			</div>
    		</div>

    		{#each Object.entries($capPool.claimableRewards || {}) as [_currencyLabel, reward]}

	    		<div class='row'>
	    			<div class='label'>
	    				<div class='top-label'>My {formatCurrency(_currencyLabel)} Rewards <!-- (<strong>{formatToDisplay($capPool.poolShares[_currencyLabel])}%</strong> of fees) --></div>
	    				<a class:disabled={reward == 0} on:click={() => {collectCAPReward(_currencyLabel)}}>Collect</a>
	    			</div>
	    			<div class='value'>
	    				{formatToDisplay(reward)} {formatCurrency(_currencyLabel)} 
    					{#if _currencyLabel == 'weth' && $prices['ETH-USD']}
    					<span class='grayed'>(${formatToDisplay($prices['ETH-USD'] * reward || 0)})</span>
    					{/if}
	    			</div>
	    		</div>

	    	{/each}

    	</div>

    </div>

    <!-- <hr>

    <h2>Old pools</h2>

    <h4><a on:click={toggleOldPools}>{#if oldPoolsShown}Hide{:else}Show{/if}</a></h4>

    {#if oldPoolsShown}

	    <h5>Please transfer your assets out of these pools as they are no longer receiving revenue.</h5>

		{#each oldPoolEntries as [_currencyLabel, poolInfo]}
			<div class='pool' class:loading={poolIsLoading[_currencyLabel + '-old'] || !poolInfo.tvl}>

				<div class='info'>
					<div class='column column-asset flex'>
						<img src={CURRENCY_LOGOS[_currencyLabel]}>
						{formatCurrency(_currencyLabel)} (old)
						<div title='Reload' class='reload' on:click={() => {reloadPoolInfo(_currencyLabel)}}>&#8635;</div>
					</div>
					<div class='column column-apr'></div>
					<div class='column column-tvl'>
						{#if poolInfo.tvl}
							{formatToDisplay(poolInfo.tvl)} 
							{#if _currencyLabel == 'weth'}
							<span class='dollar-amount'>(${formatToDisplay($prices['ETH-USD'] * poolInfo.tvl || 0)})</span>
							{/if}
						{:else if !$address}
							--
						{:else}
							<div class='loading-icon'>{@html SPINNER_ICON}</div>
						{/if}
					</div>
				</div>

				<div class='description'>
					This pool is deprecated. Please collect your rewards and transfer your assets to the current pools.
				</div>

				<div class='my-share'>

					<div class='row'>
						<div class='column column-asset label'>My Share</div>
						<div class='column column-apr'>{formatToDisplay(poolInfo.userBalance) || 0} {formatCurrency(_currencyLabel)} ({formatToDisplay(poolInfo.tvl*1 == 0 ? 0 : 100*poolInfo.userBalance/poolInfo.tvl)}%)</div>
						<div class='column column-tvl'>
							<a class:disabled={poolInfo.userBalance == 0} data-intercept="true" on:click={() => {showModal('PoolWithdraw', {currencyLabel: _currencyLabel, withdrawFee: poolInfo.withdrawFee, isOld: true})}}>Withdraw</a>
						</div>
					</div>

					<div class='row'>
						<div class='column column-asset label'>My Rewards</div>
						<div class='column column-apr'>{formatToDisplay(poolInfo.claimableReward) || 0} {formatCurrency(_currencyLabel)} 
							{#if _currencyLabel == 'weth'}
							<span class='dollar-amount'>(${formatToDisplay($prices['ETH-USD'] * poolInfo.claimableReward || 0)})</span>
							{/if}
						</div>
						<div class='column column-tvl'>
							<a class:disabled={poolInfo.claimableReward == 0} on:click={() => {collectPoolReward(_currencyLabel, true)}}>Collect</a>
						</div>
					</div>

				</div>

			</div>
	    {/each}

	{/if} -->

</div>
