const User = require("../../media_classes/user");

function convertStreamToUser(plexStream) {
  return new User(plexStream.id, plexStream.title);
}

module.exports = convertStreamToUser;
