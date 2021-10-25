import { writable } from 'svelte/store'

export const selectedProductId = writable(localStorage.getItem('selectedProductId') || 1);
export const selectedProduct = writable({});