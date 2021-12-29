export const PRODUCTS = {
	'ETH-USD': {
		hours: '24/7',
		logo: '/logos/ETH.svg',
		baseSpread: 0.00025,
		maxSlippage: 5,
		slippageExponent: 2.5,
		maxLiquidity: {
			weth: 800,
			usdc: 2500000
		}
	},
	'BTC-USD': {
		hours: '24/7',
		logo: '/logos/BTC.svg',
		baseSpread: 0.00025,
		maxSlippage: 5,
		slippageExponent: 2.5,
		maxLiquidity: {
			weth: 800,
			usdc: 2500000
		}
	}
};