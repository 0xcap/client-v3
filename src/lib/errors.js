// Error strings

const DEFAULT_ERROR = "Unidentified error. Check your browser console for more details.";

const ERROR_STRINGS = {
	'User denied': null,
	'User rejected': null,
	'insufficient balance': "You have insufficient funds to complete this transaction.",
	'exceeds balance': "You have insufficient funds to complete this transaction.",
	'allowance': "You have to approve spending this ERC20 before depositing.",
	'!position': 'Position not found.',
	'!size': "Trade size is too low.",
	'!currency': "Currency is not supported.",
	'!order': "Your order is still settling. Try again later.",
	'!exists': "This order does not exist.",
	'!margin': "Margin is too low.",
	'!min-margin': "Margin is too low (min: 0.001 ETH).",
	'!margin<fee': "Margin sent is below the required fee.",
	'!leverage': "Leverage is too low.",
	'!max-leverage': "Leverage is too high.",
	'!price': "Price is unavailable.",
	'!fee': "Submitted fee is incorrect.",
	'!user': "You're not the owner of this position.",
	'!opening': "Position is still settling. Please try again later.",
	'!closing': "Position is still closing. Please try again later.",
	'!low-leverage': "Leverage would be too low. Try adding less margin.",
	'!cooldown': "You have to wait at least 1 hour after depositing before withdrawing.",
	'!empty': "The pool is empty.",
	'!utilization': "Pool utilization ratio is too high. Please try again later or with a smaller position size.",
	'!available-balance': "Not enough non-utilized balance is available in the pool. Please try again later or with a smaller amount.",
	'!max-cap': "Maximum pool cap has been reached.",
	'!clp-amount': "Minted amount is too low.",
	'gas': "Insufficient funds or gas. Deposit more funds into your wallet or try adjusting the gas limit.",
	'nonce': 'Invalid transaction nonce. Try resetting your Metamask account.',
	'InsufficientTxFunds': "You don't have enough funds to complete this transaction."
};

export function parseErrorToString(e) {
	if (!e) return DEFAULT_ERROR;
	if (typeof(e) == 'string') return e;
	let error_string = '';
	if (e.data && e.data.message) {
		error_string = e.data.message;
	} else if (e.message) {
		error_string = e.message;
	} else {
		return DEFAULT_ERROR;
	}
	error_string = error_string.toLowerCase();
	for (const key in ERROR_STRINGS) {
		if (error_string.includes(key)) return ERROR_STRINGS[key];
	}
	console.error(e);
	return DEFAULT_ERROR;
}