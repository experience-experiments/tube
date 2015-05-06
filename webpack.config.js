/*
 * Webpack development server configuration
 *
 * This file is set up for serving the webpack-dev-server, which will watch for changes and recompile as required if
 * the subfolder /webpack-dev-server/ is visited. Visiting the root will not automatically reload.
 */
'use strict';
var webpack = require('webpack');
var path = require('path');

module.exports = {

  output: {
    filename: 'tube-app.js',
    publicPath: '/assets/'
  },

  cache: true,
  debug: true,
  devtool: false,
  entry: [
      'webpack/hot/only-dev-server',
      './app/scripts/main.js'
  ],

  stats: {
    colors: true,
    reasons: true
  },

  resolve: {
	  root: [path.join(__dirname, "/app/bower_components"), path.join(__dirname, "/app/scripts")],
    extensions: ['', '.js'],
    alias: {
      'styles': __dirname + '/app/styles'
    }
  },
  module: {
    loaders: [{
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.(png|jpg)$/,
      loader: 'url-loader?limit=8192'
    }]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
	  new webpack.ResolverPlugin(
		  new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
	  ),
	  new webpack.ProvidePlugin({
		  "window.jQuery": "jquery"
	  })
  ]

};
