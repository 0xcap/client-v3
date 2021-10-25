
export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

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

export const PRODUCTS_REVERSE = {
	'ETH-USD': 1,
	'BTC-USD': 2
};

export const ABIS = {
	router: [
		"function tradingContract() view returns(address)",
	],
	trading: [
		"function getProduct(uint256 productId) view returns(tuple(address feed, uint32 maxLeverage, uint16 oracleMaxDeviation, uint16 liquidationThreshold, uint16 fee, uint16 interest))",
		"function submitNewPosition(address currency,uint256 productId,uint256 margin,uint256 leverage,bool isLong,address referrer) payable",
		"function getUserPositions(address user) view returns(tuple(uint32 closeOrderId, uint16 productId, uint64 leverage, uint64 price, uint64 margin, address owner, uint88 timestamp, bool isLong, address currency, uint96 fee)[] _positions)"
	],
	poolETH: [],
	poolUSDC: [],
	staking: [],
	rewardsETH: [],
	rewardsUSDC: [],
	erc20: [
		"function totalSupply() view returns (uint256)",
		"function balanceOf(address account) view returns (uint256)",
		"function transfer(address recipient, uint256 amount) returns (bool)",
		"function allowance(address owner, address spender) view returns (uint256)",
		"function approve(address spender, uint256 amount) returns (bool)"
	]
};

// Contract addresses are pulled from router contract

export const CHAINDATA = {
	31337: {
		label: 'localhost',
		router: '0x0462Bc7390a33C8BB748d5c2ad76E93690A365c5',
		explorer: 'http://localhost:8545',
		currencies: {
			weth: '0x76d05F58D14c0838EC630C8140eDC5aB7CD159Dc',
			usdc: '0xd2983525E903Ef198d5dD0777712EB66680463bc'
		}
	},
	42161: {
		label: 'Arbitrum',
		router: '',
		explorer: 'https://arbiscan.io',
		rpc: 'https://arb1.arbitrum.io/rpc', // for walletconnect
		currencies: {
			weth: '',
			usdc: ''
		}
	}
}