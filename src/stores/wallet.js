import { writable, derived } from 'svelte/store'

export const provider = writable(null);
export const chainId = writable(null);
export const signer = writable(null);

export const address = derived([signer], async([$signer], set) => {
	if (!$signer) return set(null);
	console.log('$signer', $signer);
	set(await $signer.getAddress());
}, null);