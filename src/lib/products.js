export const PRODUCTS = {
	'ETH-USD': {
		hours: '24/7',
		logo: '/logos/ETH.svg',
		baseSpread: 0.0005,
		maxSlippage: 5,
		slippageExponent: 2.5,
		maxLiquidity: {
			weth: 1000,
			usdc: 2000000
		}
	},
	'BTC-USD': {
		hours: '24/7',
		logo: '/logos/BTC.svg',
		baseSpread: 0.0005,
		maxSlippage: 5,
		slippageExponent: 2.5,
		maxLiquidity: {
			weth: 1000,
			usdc: 2000000
		}
	}
};