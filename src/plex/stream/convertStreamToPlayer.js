import Player from "../../media_classes/player.js";

function convertStreamToPlayer(plexStream) {
  const player = new Player(plexStream.device, plexStream.address);
  player.platform = plexStream.platform;
  player.product = plexStream.product;
  player.title = plexStream.title;
  player.state = plexStream.state;

  return player;
}

export default convertStreamToPlayer;
