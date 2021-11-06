// Error strings

const DEFAULT_ERROR = "Unidentified error. Check your browser console for more details.";

const ERROR_STRINGS = {
	'User denied': null,
	'User rejected': null,
	'exceeds balance': "Insufficient funds to complete this transaction.",
	'!position': 'Position not found.',
	'!size': "Trade size is too low.",
	'!min-margin': "Margin is too low (min: 0.001 ETH).",
	'!leverage': "Leverage is too low.",
	'!product-active': "Product is currently paused.",
	'!max-leverage': "Leverage is too high.",
	'!price': "Price is unavailable.",
	'!fee': "Submitted fee is incorrect.",
	'!user': "You're not the owner of this position.",
	'!opening': "Position is still settling. Please try again later.",
	'!closing': "Position is still closing. Please try again later.",
	'!low-leverage': "Leverage would be too low. Try adding less margin.",
	'!cooldown': "You have to wait at least 1 hour after depositing before withdrawing.",
	'!empty': "The pool is empty",
	'!utilization': "Utilization ratio is too high. Please try again later.",
	'!available-balance': "Not enough free balance is currently available. Please try again later.",
	'!balance': "You don't have enough funds in the pool to withdraw this amount",
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
	for (const key in ERROR_STRINGS) {
		if (error_string.includes(key)) return ERROR_STRINGS[key];
	}
	console.error(e);
	return DEFAULT_ERROR;
}