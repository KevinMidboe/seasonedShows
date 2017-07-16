const StrayRepository = require('src/seasoned/strayRepository');
const strayRepository = new StrayRepository();

function verifyStrayController(req, res) {
	const id = req.params.strayId;

	strayRepository.verifyStray(id)
	.then(() => {
		res.send({ success: true, message: 'Episode verified' });
	})
	.catch((error) => {
		res.status(500).send({ success: false, error: error.message });
	});
}

module.exports = verifyStrayController;
