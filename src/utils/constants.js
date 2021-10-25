
// Products should not be chain dependent

export const PRODUCTS = {
	1: {
		symbol: 'ETH-USD',
		logo: ''
	},
	2: {
		symbol: 'BTC-USD',
		logo: ''
	}
};

export const ABIS = {
	router: [],
	trading: [],
	poolETH: [],
	poolUSDC: [],
	staking: [],
	rewardsETH: [],
	rewardsUSDC: []
};

// Contract addresses are pulled from router contract

export const CHAINDATA = {
	31337: {
		label: 'localhost',
		router: '',
		explorer: 'http://localhost:8545'
	},
	42161: {
		label: 'Arbitrum',
		router: '',
		explorer: 'https://arbiscan.io',
		rpc: 'https://arb1.arbitrum.io/rpc' // for walletconnect
	}
}