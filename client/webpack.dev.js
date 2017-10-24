/*
* @Author: KevinMidboe
* @Date:   2017-06-01 19:09:16
* @Last Modified by:   KevinMidboe
* @Last Modified time: 2017-10-24 22:12:52
*/

const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
	devtool: 'inline-source-map',
	devServer: {
		contentBase: './dist',
		headers: {'Access-Control-Allow-Origin': '*'}
	}
});;
