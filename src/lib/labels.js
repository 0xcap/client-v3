import EN from '../labels/EN.json';

import { derived } from 'svelte/store';

import { LANG_DEFAULT } from './constants';
import { language as lang } from './stores';

const LABELS = {
	EN,
};

function dig(obj, keys) {
	let current = obj;
	for (const key of keys) {
		if (key in current) {
			current = current[key];
		} else {
			return;
		}
	}
	return current;
}

function find(lang, label) {
	const keys = label.split('.');
	return dig(LABELS[lang], keys) || dig(LABELS[LANG_DEFAULT], keys);
}

export const L = derived([lang], ($lang) => (label) => find($lang, label));
