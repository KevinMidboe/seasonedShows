const StrayRepository = require('src/seasoned/strayRepository');
const strayRepository = new StrayRepository();


function readStraysController(req, res) {
	const { verified, page } = req.query;
	strayRepository.readAll(verified, page)
	.then((strays) => {
		res.send(strays);
	})
	.catch((error) => {
		res.status(500).send({success: false, error: error.message });
	});
}

module.exports = readStraysController;