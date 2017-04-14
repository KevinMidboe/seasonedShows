const configuration = require('src/config/configuration').getInstance();
const GitRepository = require('src/git/gitRepository');
const gitRepository = new GitRepository();

function dumpHookController(req, res) {
	gitRepository.dumpHook(req.body)
	.then(() => {
		res.status(200);
	})
	.catch((error) => {
		res.status(500);
	})
}

module.exports = dumpHookController;