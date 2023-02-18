export const PRODUCTS = {
	'ETH-USD': {
		hours: '24/7',
		logo: '/logos/ETH.svg',
		baseSpread: 0.0001,
		maxSlippage: 5,
		slippageExponent: 2.5,
		maxLiquidity: {
			weth: 2000,
			usdc: 8000000
		}
	},
	'BTC-USD': {
		hours: '24/7',
		logo: '/logos/BTC.svg',
		baseSpread: 0.0001,
		maxSlippage: 5,
		slippageExponent: 2.5,
		maxLiquidity: {
			weth: 3000,
			usdc: 8000000
		}
	}
};