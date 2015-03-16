'use strict';

require.config({
	baseUrl: 'scripts',
	paths: {
		d3: '../bower_components/d3/d3.min',
		jquery: '../bower_components/jquery/dist/jquery',
		typeahead: '../bower_components/typeahead.js/dist/typeahead.jquery',
		addtohomescreen: '../bower_components/addtohomescreen/index'
	},
	shim: {
		'typeahead': ["jquery"]
	}
});
