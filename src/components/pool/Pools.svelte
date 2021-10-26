<script>

	/* TODO: modal and allowances */

	import { pools } from '../../stores/pools'

	import { stakeInPool, unstakeFromPool, collectPoolReward } from '../../lib/methods'

</script>

<div class='pools'>

	<h2>Pools</h2>

	{#each Object.entries($pools) as [_currencyLabel, poolInfo]}
		<div>{_currencyLabel}: {poolInfo.tvl} |  {poolInfo.stakedBalance} | {poolInfo.claimableReward} -- <a on:click={() => {stakeInPool(_currencyLabel, 1)}}>Deposit</a> | <a on:click={() => {unstakeFromPool(_currencyLabel, 500)}}>Withdraw</a> | <a on:click={() => {collectPoolReward(_currencyLabel)}}>Collect rewards</a></div>
    {/each}


</div>