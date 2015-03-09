require.config({
	paths: {
		d3: '../bower_components/d3/d3.min'
	}
});

require(['app'], function(app) {
	app.init();
});
