// Contract interaction

import { getContract } from './contracts'
import { formatProduct } from '../utils/helpers'

export async function getProduct(productId) {
	const contract = await getContract('trading');
	return formatProduct(productId, await contract.getProduct(productId));
}