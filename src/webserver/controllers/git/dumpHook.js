import GitRepository from "../../../git/gitRepository.js";

const gitRepository = new GitRepository();

function dumpHookController(req, res) {
  gitRepository
    .dumpHook(req.body)
    .then(() => res.status(200))
    .catch(() => res.status(500));
}

export default dumpHookController;
