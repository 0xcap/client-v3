<script>
	import {_} from "../services/i18n"

	import { CURRENCY_LOGOS } from '../lib/constants'

	import { SPINNER_ICON, EXTERNAL_ICON } from '../lib/icons'

	import { capPool, allowances, prices, address } from '../lib/stores'

	import { getAllowance, collectCAPReward, approveCurrency, getCapPoolInfo } from '../lib/methods'

	import { showModal, formatCurrency, formatToDisplay } from '../lib/utils'

	async function _approveCurrency() {
		const result = await approveCurrency('cap', 'capPool');
	}

	async function getAllowances(cp) {
		if (!cp || !cp.supply) return;
		await getAllowance('cap', 'capPool');
	}

	$: getAllowances($capPool);

	let poolIsLoading = false;

	async function reloadPoolInfo() {
		poolIsLoading = true;
		await getCapPoolInfo();
		poolIsLoading = false;
	}

</script>

<style>

	.pool-cap {
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

	.dollar-amount {
		color: var(--sonic-silver);
	}

	.note {
		color: var(--sonic-silver);
		line-height: 1.618;
	}

	.note a :global(svg) {
		height: 10px;
		fill: currentColor;
	}

</style>

<div class='pool-cap'>

	<div class='columns'>

		<div class='column column-asset'>{$_('page.pool.asset')}</div>
		<div class='column column-apr'></div>
		<div class='column column-tvl'>{$_('page.pool.tvl')}</div>

	</div>

    <div class='pool' class:loading={poolIsLoading['cap'] || !$capPool.supply}>

    	<div class='info'>
    		<div class='column column-asset flex'>
    			<img src={CURRENCY_LOGOS['cap']}>
    			CAP <div title='Reload' class='reload' on:click={() => {reloadPoolInfo()}}>&#8635;</div></div>
    		<div class='column column-apr'></div>
    		<div class='column column-tvl'>
    			{#if $capPool.supply}
    				{formatToDisplay($capPool.supply)}
    			{:else if !$address}
					--
    			{:else}
    				<div class='loading-icon'>{@html SPINNER_ICON}</div>
    			{/if}
    		</div>
    	</div>

    	<div class='description'>{$_('page.pool.stakeDesc')}</div>

    	<div class='my-share'>

    		<div class='row'>
    			<div class='column column-asset label'>{$_('page.pool.myShare')}</div>
    			<div class='column column-apr'>{formatToDisplay($capPool.userBalance)} CAP ({formatToDisplay($capPool.supply*1 == 0 ? 0 : 100*$capPool.userBalance/$capPool.supply)}%)</div>
    			<div class='column column-tvl'>
    				{#if $allowances['cap'] && $allowances['cap']['capPool'] * 1 == 0}
    					<a on:click={() => {_approveCurrency()}}>{$_('page.pool.approve',{values:{currency:"CAP"}})}</a>
    				{:else}
    					<a data-intercept="true" on:click={() => {showModal('PoolDeposit', {currencyLabel: 'cap'})}}>{$_('page.pool.deposit')}</a>
						<span class='sep'>|</span>
						<a class:disabled={$capPool.userBalance == 0} data-intercept="true" on:click={() => {showModal('PoolWithdraw', {currencyLabel: 'cap'})}}>{$_('page.pool.withdraw')}</a>
    				{/if}
    			</div>
    		</div>

    		{#each Object.entries($capPool.claimableRewards || {}) as [_currencyLabel, reward]}

    			<div class='row'>
    				<div class='column column-asset label'> {$_("page.pool.stakeRewards", {values:{"currency":formatCurrency(_currencyLabel)}})}
    					<div class='sub-label'>{@html $_('page.pool.receives',{values:{"fee": formatToDisplay($capPool.poolShares[_currencyLabel])}})}</div>
    				</div>
    				<div class='column column-apr'>
    					{formatToDisplay(reward)} {formatCurrency(_currencyLabel)} 
    					{#if _currencyLabel == 'weth'}
    					<span class='dollar-amount'>(${formatToDisplay($prices['ETH-USD'] * reward || 0)})</span>
    					{/if}
    				</div>
    				<div class='column column-tvl'>
    					<a class:disabled={reward == 0} on:click={() => {collectCAPReward(_currencyLabel)}}>{$_("page.pool.collect")}</a>
    				</div>
    			</div>

    		{/each}

    	</div>

    </div>

    <div class='note'>
    	<a target='_blank' href='https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x43044f861ec040db59a7e324c40507addb673142'>{$_('page.pool.buyCapL1')} {@html EXTERNAL_ICON}</a><br/><a target='_blank' class='button' href='https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x031d35296154279dc1984dcd93e392b1f946737b'>{$_('page.pool.buyCapL2')} {@html EXTERNAL_ICON}</a>
    </div>

</div>