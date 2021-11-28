<script>
	import { _ } from '../../services/i18n';

	import Volume from '../Volume.svelte'

</script>
<style>

	.home-wrap {
		padding: var(--base-padding);
		background-color: var(--eerie-black);
		border-top: 1px solid var(--jet);
		padding-bottom: 100px;
	}

	.home {
		margin: 0 auto;
		max-width: 1260px;
	}

	.hero {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 64px 0;
		border-bottom: 1px solid var(--jet);
	}

	.hero-inner {		
		display: grid;
		grid-auto-flow: row;
		grid-gap: 24px;
		text-align: center;
	}

	.main-title {
		color: var(--green);
		font-weight: 700;
		font-size: 160%;
	}

	.tagline {
	}

	.button-wrap {
	}

	.button {
		padding: 12px var(--base-padding);
		border-radius: var(--base-radius);
		font-weight: 700;
		color: var(--green-dark);
		background-color: var(--green);
		display: inline-block;
	}
	.button:hover {
		background-color: var(--green-dim);
	}

	.volume .label {
		color: var(--sonic-silver);
		margin-top: 8px;
		font-size: 90%;
	}

	.volume .value {
		font-weight: 700;
	}

	.benefits-wrap {
		display: grid;
		grid-auto-flow: column;
		grid-gap: 48px;
		padding: 36px 0;
	}

	@media (max-width: 900px) {

		.benefits-wrap {
			grid-auto-flow: row;
		}

	}

	.benefits {
	}

	.benefits-title {
		color: var(--green);
		font-weight: 700;
		font-size: 120%;
		margin-bottom: var(--base-padding);
	}

	.item {
		margin-bottom: var(--base-padding);
	}

	.item .title {
		font-weight: 700;
		margin-bottom: 4px;
	}

	.item .description {
		line-height: 1.418;
		color: var(--sonic-silver);
	}

	.community {
		padding-top: 36px;
		text-align: center;
		line-height: 1.618;
	}

</style>

<div class='home-wrap'>

	<div class='home'>

		<div class='hero'>

			<div class='hero-inner'>

				<div class='main-title'>Cap</div>
					
				<div class='tagline'>{$_('page.home.desc')}</div>
				
				<div class='button-wrap'>
					<a class='button' href='#/trade'>{$_('comm.trade')}</a>
				</div>

				<div class='volume'>
					<div class='value'><Volume/></div>
					<div class='label'>{$_('page.home.vol')}</div>
				</div>

			</div>

		</div>

		<div class='benefits-wrap'>

			<div class='benefits'>

				<div class='benefits-title'><a href='/#/trade'>{$_('comm.trade')}</a></div>

				<div class='item'>
					<div class='title'>{$_('page.home.trade00')}</div>
					<div class='description'>{$_('page.home.trade01')}</div>
				</div>

				<div class='item'>
					<div class='title'>{$_('page.home.trade10')}</div>
					<div class='description'>{$_('page.home.trade11')}</div>
				</div>

				<div class='item'>
					<div class='title'>{$_('page.home.trade20')}</div>
					<div class='description'>{$_('page.home.trade21')}</div>
				</div>

			</div>

			<div class='benefits'>

				<div class='benefits-title'><a href='/#/pool'>{$_('comm.pool')}</a></div>

				<div class='item'>
					<div class='title'>{$_('page.home.pool00')}</div>
					<div class='description'>{$_('page.home.pool01')}</div>
				</div>

				<div class='item'>
					<div class='title'>{$_('page.home.pool10')}</div>
					<div class='description'>{$_('page.home.pool11')}</div>
				</div>

				<div class='item'>
					<div class='title'>{$_('page.home.pool20')}</div>
					<div class='description'>{$_('page.home.pool21')}</div>
				</div>

			</div>

			<div class='benefits'>

				<div class='benefits-title'><a href='/#/stake'>{$_('comm.stake')}</a></div>

				<div class='item'>
					<div class='title'>{$_('page.home.stake00')}</div>
					<div class='description'>{$_('page.home.stake01')}</div>
				</div>

				<div class='item'>
					<div class='title'>{$_('page.home.stake10')}</div>
					<div class='description'>{$_('page.home.stake11')}</div>
				</div>

				<div class='item'>
					<div class='title'>{$_('page.home.stake20')}</div>
					<div class='description'>{$_('page.home.stake21')}</div>
				</div>

			</div>

		</div>

		<div class='community'>
			{@html $_('page.home.community',{values:{"Twitter":"https://twitter.com/CapDotFinance","Telegram":"https://t.me/capfin"}} )}</div>
	</div>

</div>