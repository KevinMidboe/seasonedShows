/*
* @Author: KevinMidboe
* @Date:   2017-06-01 19:09:16
* @Last Modified by:   KevinMidboe
* @Last Modified time: 2017-06-02 19:38:45
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
				{ test: /\.scss$/, loader: 'css-loader', exclude: /node_modules/ },
				{ test: /\.css$/, loader: 'style-loader!css!scss', exclude: /node_modules/ }
				// { test: /\.css$/, loader: 'style-loader!css-loader!', exclude: /node_modules/ },
					// query: {
		   //        		presets: ['es2015']
		   //      	}
		        
				// { test: /\.css-loader$/, loader: 'style-loader!css-loader', exclude: /node_modules/ }
    	]
  	},
  	plugins: [HtmlWebpackPluginConfig]
};