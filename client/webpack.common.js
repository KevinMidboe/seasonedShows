/*
* @Author: KevinMidboe
* @Date:   2017-06-01 19:09:16
* @Last Modified by:   KevinMidboe
* @Last Modified time: 2017-10-24 21:55:41
*/

const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: {
		app: './app/index.js',
	},
	plugins: [
		new CleanWebpackPlugin(['dist']),
		new HtmlWebpackPlugin({
			template: './app/index.html',
		})
	],
	 module: {
	 	loaders: [
	 		{ test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
	 		{ test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
	 	]
	 },

	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist')
	}
};

