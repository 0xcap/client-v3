// Contract interaction
import { get } from 'svelte/store'

import { getContract } from './contracts'
import { formatProduct } from '../utils/helpers'

import { selectedProductId, selectedProduct } from '../stores/order'

export async function selectProduct(productId) {
	if (!productId) productId = get(selectedProductId);
	const contract = await getContract('trading');
	console.log('contract', contract);
	if (!contract) return;
	const product = formatProduct(productId, await contract.getProduct(productId));
	console.log('product', product);
	localStorage.setItem('selectedProductId', productId);
	selectedProductId.set(productId);
	selectedProduct.set(product);
}