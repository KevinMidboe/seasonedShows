const assert = require('assert');
var PythonShell = require('python-shell');
var async = require('async');
var PythonShell = require('python-shell');

async function find(searchterm, callback) {

  var options = {
		pythonPath: '/usr/bin/python3', 
		// pythonPath: '/Library/Frameworks/Python.framework/Versions/3.6/bin/python3',
		args: [searchterm]
	}

	PythonShell.run('../app/pirateSearch.py', options, callback);
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
	return await new Promise((resolve) => {
		return find(query, function(err, results) {
			resolve(JSON.parse(results, null, '\t'));
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
