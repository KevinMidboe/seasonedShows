/*
* @Author: KevinMidboe
* @Date:   2017-06-01 19:09:16
* @Last Modified by:   KevinMidboe
* @Last Modified time: 2017-10-24 22:26:29
*/

const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require('./webpack.common.js');
var webpack = require('webpack')

module.exports = merge(common, {
	plugins: [
		new UglifyJSPlugin(),
		new HtmlWebpackPlugin({
			template: './app/index.html',
		 	title: 'Caching'
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
		}),
	],
	output: {
		filename: '[name].[chunkhash].js',
	}
});
