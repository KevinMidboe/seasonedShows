import StrayRepository from "../../../seasoned/strayRepository.js";

const strayRepository = new StrayRepository();

function strayByIdController(req, res) {
  const id = req.params.strayId;

  strayRepository
    .read(id)
    .then(stray => {
      res.send(stray);
    })
    .catch(error => {
      res.status(500).send({ success: false, message: error.message });
    });
}

export default strayByIdController;
