import { get } from 'svelte/store'

import { selectProduct, selectCurrency, getUserPositions } from './methods'

import { currentPage } from '../stores/router'


// Fetchs appropriate data from contracts and APIs. Called on route or signer change
export function hydrateData() {

	const _currentPage = get(currentPage);

	console.log('hydrateData', _currentPage);

	if (!_currentPage || _currentPage == 'home') {
		//selectProduct();
	} else if (_currentPage == 'trade') {
		selectProduct();
		selectCurrency();
		getUserPositions();
	}

}