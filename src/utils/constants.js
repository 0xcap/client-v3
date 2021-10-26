
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

		"function getPoolContract(address currency) view returns(address)",
		"function getPoolRewardsContract(address currency) view returns(address)",
		"function getCapRewardsContract(address currency) view returns(address)"
	],
	trading: [
		"function getProduct(uint256 productId) view returns(tuple(address feed, uint32 maxLeverage, uint16 oracleMaxDeviation, uint16 liquidationThreshold, uint16 fee, uint16 interest))",
		"function submitNewPosition(address currency,uint256 productId,uint256 margin,uint256 leverage,bool isLong,address referrer) payable",
		"function getUserPositions(address user) view returns(tuple(uint32 closeOrderId, uint16 productId, uint64 leverage, uint64 price, uint64 margin, address owner, uint88 timestamp, bool isLong, address currency, uint64 fee, uint32 positionId)[] _positions)"
	],
	pool: [
		"function getStakedBalance(address account) view returns(uint256)",
		"function clpSupply() view returns(uint256)",

		"function mintAndStakeCLP(uint256 amount) payable returns(uint256)",
		"function unstakeAndBurnCLP(uint256 amount) returns(uint256)"
	],
	staking: [],
	rewards: [
		"function getClaimableReward() view returns(uint256)",

		"function collectReward()"
	],
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
		router: '0xC070A317F23E9A4e982e356485416251dd3Ed944',
		explorer: 'http://localhost:8545',
		currencies: {
			weth: '0x1F585372F116E1055AF2bED81a808DDf9638dCCD',
			usdc: '0x39826E09f8efb9df4C56Aeb9eEC0D2B8164d3B36'
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