const configuration = require('src/config/configuration').getInstance();
const StrayRepository = require('src/seasoned/strayRepository');
const strayRepository = new StrayRepository();

function strayByIdController(req, res) {
	const id = req.params.strayId;

	strayRepository.read(id)
	.then((stray) => {
		res.send(stray);
	})
	.catch((error) => {
		res.status(500).send({ success: false, error: error.message });
	});
}

module.exports = strayByIdController;
