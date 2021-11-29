import { get } from 'svelte/store'

import Datafeed from './datafeed.js'

import { product, positions, chartResolution, chartLoading } from './stores'

let candles = []; // current candle set

// In ms
let start;
let end;

let chart;
let candlestickSeries;

let isLoadingCandles = false;

// how much history to load for each resolution (in ms)
const lookbacks = {
	60: 300 * 60 * 1000,
	300: 24 * 60 * 60 * 1000,
	900: 48 * 60 * 60 * 1000,
	3600: 12 * 24 * 60 * 60 * 1000,
	21600: 6 * 12 * 24 * 60 * 60 * 1000,
	86400: 24 * 12 * 24 * 60 * 60 * 1000,
};

let chartWidget;

const green_color = "#1FF273";
const red_color = "#FF342D";
const light_gray = "#858589";

const watermarkColor = 'rgba(118, 123, 133, 0.15)';

const originalGridColor = '#2b2b2d';
const gridColor = originalGridColor;

export function initChart() {

	let script = document.createElement("script");
	script.setAttribute("src", "/charting_library/charting_library.standalone.js");
	document.body.appendChild(script);

	script.addEventListener("load", scriptLoaded, false);

	async function scriptLoaded() {

		const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

		const selected_theme = localStorage.getItem('theme');

		const widgetOptions = {
			symbol: 'BTC-USD',
			datafeed: Datafeed,
			interval: get(chartResolution),
			container_id: 'chart',
			library_path: '/charting_library/',
			locale: 'en',
			disabled_features: [
				"use_localstorage_for_settings", 
				"header_symbol_search", 
				"symbol_search_hot_key", 
				"compare_symbol", 
				"border_around_the_chart", 
				"symbol_info", 
				"header_compare",
				"header_interval_dialog_button",
				"show_interval_dialog_on_key_press", 
				"study_templates", 
				"timeframes_toolbar", 
				"legend_context_menu", 
				"display_market_status", 
				"create_volume_indicator_by_default",
				"header_fullscreen_button",
				"header_settings",
				"countdown"
			],
			enabled_features: [
				"left_toolbar", 
				"side_toolbar_in_fullscreen_mode", 
				"keep_left_toolbar_visible_on_small_screens"
			],
			client_id: 'cap',
			fullscreen: false,
			autosize: true,
			allow_symbol_change: false,
			custom_css_url: 'chart.css',
			theme: 'dark',
			overrides: {
				'symbolWatermarkProperties.color': watermarkColor,

				'originalGridColor': originalGridColor,

				'scalesProperties.showRightScale': true,
				'scalesProperties.showLeftScale': false,
				'scalesProperties.textColor': '#fff',
				'scalesProperties.lineColor': 'transparent',
				'scalesProperties.backgroundColor': '#1b1b1d',
				
				'paneProperties.background': '#1b1b1d',
				'paneProperties.vertGridProperties.color': gridColor,
				'paneProperties.horzGridProperties.color': gridColor,
				'paneProperties.crossHairProperties.color': '#ccc',
				'paneProperties.crossHairProperties.style': 1,
				'paneProperties.leftAxisProperties.autoScale': true,
				'paneProperties.rightAxisProperties.autoScale': true,

				'mainSeriesProperties.style': 1,
				'mainSeriesProperties.showCountdown': true,
				'mainSeriesProperties.showPriceLine': true,
				'mainSeriesProperties.priceLineColor': light_gray,
				'mainSeriesProperties.priceAxisProperties.autoScale': true,
				'mainSeriesProperties.rightAxisProperties.autoScale': true,

				'mainSeriesProperties.candleStyle.upColor': green_color,
				'mainSeriesProperties.candleStyle.downColor': red_color,
				'mainSeriesProperties.candleStyle.borderUpColor': green_color,
				'mainSeriesProperties.candleStyle.borderDownColor': red_color,
				'mainSeriesProperties.candleStyle.wickUpColor': light_gray,
				'mainSeriesProperties.candleStyle.wickDownColor': light_gray,

				'mainSeriesProperties.hollowCandleStyle.upColor': green_color,
				'mainSeriesProperties.hollowCandleStyle.downColor': red_color,
				'mainSeriesProperties.hollowCandleStyle.borderUpColor': green_color,
				'mainSeriesProperties.hollowCandleStyle.borderDownColor': red_color,
				'mainSeriesProperties.hollowCandleStyle.wickColor': light_gray,

				'mainSeriesProperties.haStyle.upColor': green_color,
				'mainSeriesProperties.haStyle.downColor': red_color,
				'mainSeriesProperties.haStyle.borderUpColor': green_color,
				'mainSeriesProperties.haStyle.borderDownColor': red_color,
				'mainSeriesProperties.haStyle.wickColor': light_gray,

				'mainSeriesProperties.barStyle.upColor': green_color,
				'mainSeriesProperties.barStyle.downColor': red_color,

				'mainSeriesProperties.lineStyle.color': "#ff5722",
				'mainSeriesProperties.lineStyle.linewidth': 2,

				'mainSeriesProperties.areaStyle.color1': "#2b344b",
				'mainSeriesProperties.areaStyle.color2': "#2b344b",
				'mainSeriesProperties.areaStyle.lineColor': "#ff5722",
				'mainSeriesProperties.areaStyle.linewidth': 2
			},
			timezone
		};

		let mouse_chart_price = 0, mouseClickTimeout = null, lastCrossHair;

		if (!window.TradingView) return;

		const widget = window.tvWidget = new window.TradingView.widget(widgetOptions);

		console.log('window.TradingView', window.TradingView, window.tvWidget);

		widget.onChartReady(() => {

			// Chart iframe theme
			let iframe = document.querySelector('#chart iframe');
			let innerDoc = iframe.contentDocument || iframe.contentWindow.document;
			if (innerDoc) {
				innerDoc.body.className = '';
			}

			chartWidget = widget.chart();
			
			chartWidget.onIntervalChanged().subscribe(null, function(interval, obj) {
				localStorage.setItem('chartResolution', interval);
			});
			
		});

	}

}

// timezone corrected time in seconds
function correctedTime(time) {
	const timezoneOffsetMinutes = new Date().getTimezoneOffset();
	//console.log('timezoneOffsetMinutes', timezoneOffsetMinutes);
	return time-(timezoneOffsetMinutes*60)
}

export function applyWatermark() {
	const _product = get(product).symbol;
	if (!_product) return;
	chart && chart.applyOptions({
	    watermark: {
	        color: '#292929',
	        visible: true,
	        text: _product,
	        fontSize: 48,
	        horzAlign: 'center',
	        vertAlign: 'center',
	    },
	});
}

export async function setResolution(_resolution) {
	chartResolution.set(_resolution);
	localStorage.setItem('chartResolution', _resolution);
	chartLoading.set(true);
	await loadCandles(_resolution);
	chartLoading.set(false);
}

export async function loadCandles(_resolution, _start, _end, prepend, productOverride) {

	//console.log('called loadCandles', _resolution, _start, _end, prepend);

	let _product = productOverride || get(product).symbol;

	//console.log('candlestickSeries', candlestickSeries);
	//console.log('_product', _product);

	if (!candlestickSeries || !_product) {
		// try again
		// console.log('attempting chart again...');
		setTimeout(() => {
			loadCandles(_resolution, _start, _end, false, !_product ? 'ETH-USD' : false);
		}, 2000);
		return;
	}

	if (!_resolution) {
		_resolution = get(chartResolution);
	}

	//console.log('_product', _product);
	//console.log('resolution', _resolution, lookbacks[_resolution]);

	if (!_start || !_end) { // test
		_start = Date.now() - lookbacks[_resolution];
		_end = Date.now();
	}

	start = _start;
	end = _end;

	const url_start = encodeURIComponent(new Date(start).toString());
	const url_end = encodeURIComponent(new Date(end).toString());

	const response = await fetch(`https://api.exchange.coinbase.com/products/${_product}/candles?granularity=${_resolution}&start=${url_start}&end=${url_end}`);
	const json = await response.json();

	if (!json || !Array.isArray(json)) {
		return console.log('json invalid', json);
	}

	if (prepend) {
		// prepend candles to existing set
		let prepend_set = [];
		for (const item of json) {
			prepend_set.push({
				time: correctedTime(item[0]),
				low: item[1],
				high: item[2],
				open: item[3],
				close: item[4]
			});
		}
		prepend_set.reverse();
		candles = prepend_set.concat(candles);
	} else {
		candles = [];
		for (const item of json) {
			candles.push({
				time: correctedTime(item[0]),
				low: item[1],
				high: item[2],
				open: item[3],
				close: item[4]
			});
		}
		candles.reverse();
	}

	//console.log('data', data);

	// set data
	candlestickSeries.setData(candles);

	//chart.timeScale().fitContent();

}

export function onNewPrice(price, timestamp, _product) {
	// add data point to current candle set
	// use update with time = last time for this resolution
	// get last data point to update ohlc values based on given data point

	//candlestickSeries.update({ time: '2019-01-01', open: 60.71, high: 60.71, low: 53.39, close: 59.29 });

	const symbol = get(product).symbol;

	if (_product != symbol) return;

	let lastCandle = candles[candles.length - 1];

	if (!lastCandle) return;

	timestamp = correctedTime(timestamp/1000);

	const resolution = get(chartResolution);

	if (timestamp >= lastCandle.time + resolution) {
		// new candle
		let candle = {
			time: parseInt(resolution * parseInt(timestamp/resolution)),
			low: price,
			high: price,
			open: price,
			close: price
		}
		candles.push(candle);
		candlestickSeries.update(candle);
	} else {
		// update existing candle
		if (lastCandle.low > price) lastCandle.low = price;
		if (lastCandle.high < price) lastCandle.high = price;
		lastCandle.close = price;

		candles[candles.length - 1] = lastCandle;
		candlestickSeries.update(lastCandle);
	}

}

let pricelines = [];

export function loadPositionLines() {

	return; // disabled for now
	
	//console.log('loadPositionLines');

	if (!candlestickSeries) {
		//console.log('nope2');
		setTimeout(loadPositionLines, 2000);
		return;
	}

	clearPositionLines();

	const _positions = get(positions);

	//console.log('_positions', _positions);

	for (const _pos of _positions) {

		//if (!_pos.price) continue;

		pricelines.push(
			candlestickSeries.createPriceLine({
			    price: _pos.price * 1 + 4280,
			    color: 'green',
			    lineWidth: 2,
			    lineStyle: LightweightCharts.LineStyle.Dotted,
			    axisLabelVisible: true,
			    title: _pos.amount,
			})
		);

	}

}

function clearPositionLines() {
	for (const priceline of pricelines) {
		candlestickSeries.removePriceLine(priceline);
	}
	pricelines = [];
}