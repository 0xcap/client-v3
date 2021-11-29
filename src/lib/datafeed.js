import { get } from 'svelte/store'

import { PRODUCTS } from './constants'
import { prices, chartResolution, product } from './stores'

export const DEFAULT_RESOLUTIONS = ["1", "5", "15", "60", "240", "1D"];
export const AVAILABLE_RESOLUTIONS = ["1", "5", "15", "30", "60", "120", "180", "240", "720", "1D"];

// how much history to load for each resolution (in ms)
const lookbacks = {
	60: 300 * 60 * 1000,
	300: 24 * 60 * 60 * 1000,
	900: 48 * 60 * 60 * 1000,
	3600: 12 * 24 * 60 * 60 * 1000,
	21600: 6 * 12 * 24 * 60 * 60 * 1000,
	86400: 24 * 12 * 24 * 60 * 60 * 1000,
};

const sessions = {
	crypto: '24x7',
	forex: '1700-1700:123456',
	stocks: '0930-1600:23456'
};

function makeSymbolInfo(symbol, productData) {
	const {
		type,
		tick,
		name
	} = productData;
	console.log('productData', productData);
	return {
		name: name || symbol,
		ticker: symbol,
		has_intraday: true,
		session: sessions[type] || '24x7',
		data_status: 'streaming',
		type,
		timezone: 'UTC',
		supported_resolutions: type == 'stocks' ? DEFAULT_RESOLUTIONS : AVAILABLE_RESOLUTIONS,
		intraday_multipliers: DEFAULT_RESOLUTIONS,
		minmov: 1,
		pricescale: Math.round(1/tick)
	}
}

async function loadCandles(options, callback) {

	let {
		symbol,
		resolution,
		countBack,
		end
	} = options;

	console.log('options', options);

	//console.log('called loadCandles', _resolution, _start, _end, prepend);

	let _product = symbol;

	if (!resolution) {
		resolution = get(chartResolution);
	}

	if (resolution != 60) return;

	//resolution = resolution * 60;

	if (countBack > 300) countBack = 300;

	let start = end - resolution * countBack;

	start = start * 1000;
	end = end * 1000;

	const url_start = encodeURIComponent(new Date(start).toString());
	const url_end = encodeURIComponent(new Date(end).toString());

	const response = await fetch(`https://api.exchange.coinbase.com/products/${_product}/candles?granularity=${resolution}&start=${url_start}&end=${url_end}`);
	const json = await response.json();

	if (!json || !Array.isArray(json)) {
		return console.log('json invalid', json);
	}


	let candles = [];
	for (const item of json) {
		candles.push({
			time: item[0],
			low: item[1],
			high: item[2],
			open: item[3],
			close: item[4]
		});
	}

	callback(null, candles);

}

class Datafeed {

	constructor() {
		this.subscriptionIntervalMs = 0;
		this.lastCandle = null;
		this.selectedProduct = null;
		this.callback = null;
		this.rangeStartDate = null;
		this.rangeEndDate = null;
		this.symbolTicker = null;
		this.prevProduct = null;
		this.prevResolution = null;
	}

	onReady(callback) {

		let configuration = {
			supports_search: false,
			supports_marks: false,
			supports_timescale_marks: false,
			supported_resolutions: AVAILABLE_RESOLUTIONS,
			supports_time: true
		};

		setTimeout(function() {
			callback(configuration)
		}, 0)

		this.initializeDataUpdateListener()
	}

	initializeDataUpdateListener() {

		prices.subscribe((val) => {

			if (!val) return;

			const symbol = get(product).symbol;

			const price = val[symbol];

			if (!this.lastCandle) return;

			timestamp = correctedTime(timestamp/1000);

			const resolution = get(chartResolution);

			if (timestamp >= this.lastCandle.time + resolution) {
				// new candle
				let candle = {
					time: parseInt(resolution * parseInt(timestamp/resolution)),
					low: price,
					high: price,
					open: price,
					close: price
				}
				this.lastCandle = candle;
			} else {
				// update existing candle
				if (this.lastCandle.low > price) this.lastCandle.low = price;
				if (this.lastCandle.high < price) this.lastCandle.high = price;
				this.lastCandle.close = price;
			}

			this.callback(this.lastCandle);

		});

	}

	resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {

		setTimeout(function() {
			onSymbolResolvedCallback(makeSymbolInfo(symbolName, PRODUCTS[symbolName]));
		}, 0);		

	}

	getBars(symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) {

		console.log('getbars', symbolInfo, resolution);

	    let payload = {
	    	symbol: symbolInfo.ticker,
	    	resolution: resolution,
	    	countBack: periodParams.countBack,
	    	end: periodParams.to
	    };

	    loadCandles(payload, (err, data) => {

	    	if (!err && data) {

	    		console.log('got data', data);

	    		data.reverse();
	    		
    			onHistoryCallback(data, {noData: false, nextTime: data.nextTime || 0});

	    		// let bars = [], noData = false;

	    		// if (Array.isArray(data) && data.length > 0) {

		    	// 	if (this.lastCandle && !newSymbol) {
		    	// 		let newLastCandle = data[0];
		    	// 		if (newLastCandle[0] > this.lastCandle[0]) {
		    	// 			this.lastCandle = newLastCandle;
		    	// 		}
		    	// 	} else {
		    	// 		this.lastCandle = data[0];
		    	// 	}

		    	// 	// bar returned is [t,o,h,l,c]

		    	// 	// candle smoothing
		    	// 	let previousCandle;
		    	// 	for (let i = data.length - 1; i >=0; i--) {
		    	// 		let candle = data[i];
		    	// 		if (previousCandle) {
		    	// 			candle[1] = previousCandle[4];
		    	// 			if (candle[1] < candle[3]) {
		    	// 				candle[4] = candle[2];
		    	// 			}
		    	// 			if (candle[1] > candle[2]) {
		    	// 				candle[2] = candle[1];
		    	// 			}
		    	// 		}
		    	// 		previousCandle = candle;
		    	// 		bars.push(buildBar(candle));
		    	// 	}

		    	// } else {
		    	// 	if (!data.nextTime) {
		    	// 		noData = true;
		    	// 	}
		    	// }

    			// onDataCallback(data, {noData, nextTime: data.nextTime || 0});

	    	} else {
	    		onHistoryCallback([], {noData: true})
	    	}

	    })

	}

	subscribeBars(symbolInfo, resolution, onRealtimeCallback, listenerGUID, onResetCacheNeededCallback) {
		const product = symbolInfo.ticker;
		this.callback = onRealtimeCallback;
		this.prevProduct = symbolInfo.ticker;
		this.prevResolution = resolution;
	}

	unsubscribeBars(listenerGUID) {
		//UnsubscribeTicker(this.selectedInstrumentId)
	}

	calculateHistoryDepth(resolution, resolutionBack, intervalBack) {
		// resolution is one of ["1", "5", "15", "60", "240", "1D"]
		// resolutionBack can be D or M
		// intervalBack is amount of resolutionBack to request. can be decimal
		
		resolutionBack = 'D';
		let candle_qty = 12 * 24;

		switch(resolution) {
			case '1':
				candle_qty = 60 * 24; // '1's in one 'D'
				break;
			case '5':
				candle_qty = 12 * 24; // '5's in one 'D'
				break;
			case '15':
				candle_qty = 4 * 24; // '15's in one 'D'
				break;
			case '60':
				candle_qty = 24; // '60's in one 'D'
				break;
			case '240':
				candle_qty = 6; // '240's in one 'D'
				break;
			case '1D':
				resolutionBack = 'M';
				candle_qty = 30; // '1D's in one 'M'
				break;
		}

		intervalBack = Math.floor(100 * CANDLE_REQUEST_LIMIT / candle_qty) / 100;

		return {
			resolutionBack,
			intervalBack
		};

	}

}

export default new Datafeed();