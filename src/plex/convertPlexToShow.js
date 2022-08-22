import Show from "./types/show";

function convertPlexToShow(plexShow) {
  const show = new Show(plexShow.title, plexShow.year);
  show.summary = plexShow.summary;
  show.rating = plexShow.rating;
  show.seasons = plexShow.childCount;
  show.episodes = plexShow.leafCount;

  return show;
}

export default convertPlexToShow;
