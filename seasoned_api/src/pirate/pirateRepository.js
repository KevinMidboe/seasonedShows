const assert = require('assert');
var PythonShell = require('python-shell');
var async = require('async');

async function find(searchterm, callback) {

  var options = {
		pythonPath: '/usr/bin/python3', 
		// pythonPath: '/Library/Frameworks/Python.framework/Versions/3.6/bin/python3',
		args: [searchterm, '-s', 'piratebay', '--print']
	}

	PythonShell.run('../app/torrent_search/torrentSearch/search.py', options, callback);
  // PythonShell does not support return
};


async function callPythonAddMagnet(magnet, callback) {
	var options = {
		pythonPath: '/usr/bin/python', 
		// pythonPath: '/Library/Frameworks/Python.framework/Versions/3.6/bin/python3',
		args: [magnet]
	}

	PythonShell.run('../app/magnet.py', options, callback);
}

async function SearchPiratebay(query) {
	return await new Promise((resolve, reject) => {
		return find(query, function(err, results) {
			if (err) {
				console.log('THERE WAS A FUCKING ERROR!')
				reject(Error('There was a error when searching for torrents'))
			}
			if (results) {
				console.log('result', results);
				resolve(JSON.parse(results, null, '\t'));
			}
		})
	})
}

async function AddMagnet(magnet) {
	return await new Promise((resolve) => {
		return callPythonAddMagnet(magnet, function(err, results) {
			if (err) {
				console.log(err)
			}
			resolve({ success: true })
		})
	})
}

module.exports = { SearchPiratebay, AddMagnet }
