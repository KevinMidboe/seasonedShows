import Plex from "../src/plex/plex.js";
import establishedDatabase from "../src/database/database.js";
import Configuration from "../src/config/configuration.js";

const configuration = Configuration.getInstance();
const plex = new Plex(
  configuration.get("plex", "ip"),
  configuration.get("plex", "token")
);

const queries = {
  getRequestsNotYetInPlex: `SELECT * FROM requests WHERE status = 'requested' OR status = 'downloading'`,
  saveNewStatus: `UPDATE requests SET status = ? WHERE id IS ? and type IS ?`
};

const getRequestsNotYetInPlex = () =>
  establishedDatabase.all(queries.getRequestsNotYetInPlex);

async function getNewRequestMatchesInPlex() {
  const requests = await getRequestsNotYetInPlex();
  const exists = await Promise.all(
    requests.map(request => plex.existsInPlex(request))
  );

  return requests.filter(() => exists.shift());
}

function commitNewStatus(status, id, type, title) {
  console.log(`${type} ${title} updated to: ${status}`);
  return establishedDatabase.run(queries.saveNewStatus, [status, id, type]);
}

function updateMatchInDb(match, status) {
  return commitNewStatus(status, match.id, match.type, match.title);
}

getNewRequestMatchesInPlex()
  .then(newMatches =>
    Promise.all(newMatches.map(match => updateMatchInDb(match, "downloaded")))
  )
  .finally(() => process.exit(0));
