import GitRepository from "../../../git/gitRepository";

const gitRepository = new GitRepository();

function dumpHookController(req, res) {
  gitRepository
    .dumpHook(req.body)
    .then(() => res.status(200))
    .catch(() => res.status(500));
}

export default dumpHookController;
