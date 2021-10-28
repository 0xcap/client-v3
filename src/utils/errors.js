// Error strings

const DEFAULT_ERROR = "Unidentified error. Check your browser console for more details.";

const ERROR_STRINGS = {
	'User denied': null,
	'User rejected': null,
	'exceeds balance': "Insufficient funds to complete this transaction.",
	'!position': 'Position not found.',
	'!margin': "Margin is too low (min: 0.001 ETH).",
	'!leverage': "Leverage is too low.",
	'!product-active': "Product is currently paused.",
	'!max-leverage': "Leverage is too high.",
	'!price': "Price is unavailable.",
	'!owner': "You're not the owner of this position.",
	'!opening': "Position is still settling. Please try again later.",
	'!closing': "Position is still closing. Please try again later.",
	'!duration': "Minimum position hold time is 2min. Please try again later.",
	'!exposure-long': "Too many longs on this product right now. Please try again later or with a smaller amount.",
	'!exposure-short': "Too many shorts on this product right now. Please try again later or with a smaller amount.",
	'!low-leverage': "Leverage would be too low. Try adding less margin.",
	'!vault-insufficient': "Not enough funds in the vault to complete this trade. Please try again later.",
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
	for (const key in ERROR_STRINGS) {
		if (error_string.includes(key)) return ERROR_STRINGS[key];
	}
	console.error(e);
	return DEFAULT_ERROR;
}