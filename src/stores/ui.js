// toasts, modals

import { writable } from 'svelte/store'

export const toast = writable(null);
export const activeModal = writable({});

export const chartResolution = writable(900);