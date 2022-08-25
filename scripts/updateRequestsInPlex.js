import Plex from "../src/plex/plexRepository";
import establishedDatabase from "../src/database/database";
import Configuration from "../src/config/configuration";

const configuration = Configuration.getInstance();
const plex = new Plex(
  configuration.get("plex", "ip"),
  configuration.get("plex", "token")
);

const queries = {
  getRequestsNotYetInPlex: `SELECT * FROM requests WHERE status = 'requested' OR status = 'downloading'`,
  saveNewStatus: `UPDATE requests SET status = ? WHERE id IS ? and type IS ?`
};

const getByStatus = () =>
  establishedDatabase.all(queries.getRequestsNotYetInPlex);

const checkIfRequestExistInPlex = async request => {
  request.existsInPlex = await plex.existsInPlex(request);
  return request;
};

const commitNewStatus = (status, id, type, title) => {
  console.log(type, title, "updated to:", status);
  return establishedDatabase.run(queries.saveNewStatus, [status, id, type]);
};

const getNewRequestMatchesInPlex = async () => {
  const requests = await getByStatus();

  return Promise.all(requests.map(checkIfRequestExistInPlex))
    .catch(error =>
      console.log("error from checking plex for existance:", error)
    )
    .then(matchedRequests =>
      matchedRequests.filter(request => request.existsInPlex)
    );
};

const updateMatchInDb = (match, status) => {
  return commitNewStatus(status, match.id, match.type, match.title);
};

getNewRequestMatchesInPlex()
  .then(newMatches =>
    Promise.all(newMatches.map(match => updateMatchInDb(match, "downloaded")))
  )
  .then(() => process.exit(0));
