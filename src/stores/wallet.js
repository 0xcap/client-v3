import { writable, derived } from 'svelte/store'

export const provider = writable(null);
export const chainId = writable(null);
export const signer = writable(null);
export const address = writable(null);

export const allowances = writable({});

export const wrongNetwork = writable(false);