
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
	router: [
		"function tradingContract() view returns(address)",
	],
	trading: [
		"function getProduct(uint256 productId) view returns(tuple(address feed, uint32 maxLeverage, uint16 oracleMaxDeviation, uint16 liquidationThreshold, uint16 fee, uint16 interest))",
	],
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
		router: '0x0462Bc7390a33C8BB748d5c2ad76E93690A365c5',
		explorer: 'http://localhost:8545'
	},
	42161: {
		label: 'Arbitrum',
		router: '',
		explorer: 'https://arbiscan.io',
		rpc: 'https://arb1.arbitrum.io/rpc' // for walletconnect
	}
}