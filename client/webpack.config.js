/*
* @Author: KevinMidboe
* @Date:   2017-06-01 19:09:16
* @Last Modified by:   KevinMidboe
* @Last Modified time: 2017-09-02 15:51:52
*/

const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
	template: './app/index.html',
	filename: 'index.html',
	inject: 'body'
})

module.exports = {
	entry: './app/index.js',
	output: {
		path: path.resolve('dist'),
		filename: 'index_bundle.js'
	},
	devServer: {
		headers: {'Access-Control-Allow-Origin': '*'}
	},
	module: {
		loaders: [
				{ test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
				{ test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
    	]
  	},
  	plugins: [HtmlWebpackPluginConfig]
};