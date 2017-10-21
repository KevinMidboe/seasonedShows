const assert = require('assert');
var PythonShell = require('python-shell');
var async = require('async');

async function find(searchterm, callback) {
  var PythonShell = require('python-shell');

  var options = {
		// pythonPath: '/usr/bin/python3', 
		pythonPath: '/Library/Frameworks/Python.framework/Versions/3.6/bin/python3',
		args: [searchterm]
	}

	PythonShell.run('../app/pirateSearch.py', options, callback);
  // PythonShell does not support return
};

async function SearchPiratebay(query) {
	return await new Promise((resolve) => {
		return find(query, function(err, results) {
			resolve(JSON.parse(results, null, '\t'));
		})
	})
}

module.exports = { SearchPiratebay }