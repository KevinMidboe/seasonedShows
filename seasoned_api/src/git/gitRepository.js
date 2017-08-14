const assert = require('assert');

class GitRepository {

	dumpHook(body) {
		console.log(body);
	}
}

module.exports = GitRepository;