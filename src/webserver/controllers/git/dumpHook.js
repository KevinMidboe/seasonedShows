/*
* @Author: KevinMidboe
* @Date:   2017-04-14 17:11:58
* @Last Modified by:   KevinMidboe
* @Last Modified time: 2017-04-14 17:13:40
*/

const configuration = require('src/config/configuration').getInstance();

function dumpHookController(req, res) {
	console.log(req);
}

module.exports = dumpHookController;