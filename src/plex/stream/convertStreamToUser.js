import User from "../../media_classes/user";

function convertStreamToUser(plexStream) {
  return new User(plexStream.id, plexStream.title);
}

export default convertStreamToUser;
