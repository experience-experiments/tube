'use strict';

module.exports = function (grunt) {

	require('load-grunt-tasks')(grunt);

	require('time-grunt')(grunt);

	var webpackDistConfig = require('./webpack.dist.config.js'),
			webpackDevConfig = require('./webpack.config.js');


	var config = {
		app: 'app',
		dist: 'dist'
	};

	grunt.initConfig({

		// Project settings
		config: config,

		webpack: {
			options: webpackDistConfig,
			dist: {
				cache: false
			}
		},

		'webpack-dev-server': {
			options: {
				hot: true,
				port: 8000,
				webpack: webpackDevConfig,
				publicPath: '/assets/',
				contentBase: './<%= config.app %>/'
			},

			start: {
				keepAlive: true
			}
		},

		connect: {
			options: {
				port: 8000
			},

			dist: {
				options: {
					keepalive: true,
					middleware: function (connect) {
						return [
							connect.static(require('path').resolve(config.dist))
						];
					}
				}
			}
		},

		open: {
			options: {
				delay: 500
			},
			dev: {
				path: 'http://localhost:<%= connect.options.port %>/webpack-dev-server/'
			},
			dist: {
				path: 'http://localhost:<%= connect.options.port %>/'
			}
		},

		// Empties folders to start fresh
		clean: {
			dist: {
				files: [
					{
						dot: true,
						src: [
							'<%= config.dist %>/*',
							'!<%= config.dist %>/.git*'
						]
					}
				]
			}
		}

	});

// The development server (the recommended option for development)
	grunt.registerTask("default", ["open:dev", "webpack-dev-server:start"]);

	// Production build
	grunt.registerTask("build", ["clean:dist","open:dist", "webpack:dist"]);
};
