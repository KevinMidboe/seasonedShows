/*
* @Author: KevinMidboe
* @Date:   2017-05-03 23:26:46
* @Last Modified by:   KevinMidboe
* @Last Modified time: 2017-05-03 23:27:59
*/

const configuration = require('src/config/configuration').getInstance();

function hookDumpController(req, res) {
	console.log(req);
}

module.exports = hookDumpController;