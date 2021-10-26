<script>

	/* TODO: modal and allowances */

	import { staking } from '../../stores/staking'

	import { stakeCAP, unstakeCAP, collectCAPReward, approveCurrency } from '../../lib/methods'

	import { allowances } from '../../stores/wallet'

	async function _approveCurrency() {
		const result = await approveCurrency('cap', 'capStaking');
	}

</script>

<div class='staking'>

	<h2>Staking</h2>

	<div>{$staking.stakedSupply} |  {$staking.stakedBalance} -- 

		{#if $allowances['cap'] && $allowances['cap']['capStaking'] * 1 == 0}<a on:click={() => {_approveCurrency()}}>Approve</a>{/if} | <a on:click={() => {stakeCAP(2)}}>Stake</a> | <a on:click={() => {unstakeCAP(1)}}>Unstake</a></div>

	{#if $staking.claimableRewards}
	{#each Object.entries($staking.claimableRewards) as [_currencyLabel, reward]}

		<div>Claimable {_currencyLabel}: {reward} - <a on:click={() => {collectCAPReward(_currencyLabel)}}>Collect rewards</a></div>
	{/each}
	{/if}

</div>