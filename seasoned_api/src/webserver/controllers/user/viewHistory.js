const configuration = require('src/config/configuration').getInstance();
const Tautulli = require('src/tautulli/tautulli');
const tautulli = new Tautulli('', '', );

function handleError(error, res) {
  const { status, message } = error;

  if (status && message) {
    res.status(status).send({ success: false, message })
  } else {
    console.log('caught view history controller error', error)
    res.status(500).send({ message: 'An unexpected error occured while fetching view history'})
  }
}

function watchTimeStatsController(req, res) {
  const user = req.loggedInUser;

  tautulli.watchTimeStats(user.plex_userid)
    .then(data => {
      console.log('data', data, JSON.stringify(data.response.data))

      return res.send({
        success: true,
        data: data.response.data,
        message: 'watch time successfully fetched from tautulli'
      })
    })
}

function getPlaysByDayOfWeekController(req, res) {
  const user = req.loggedInUser;
  const { days, y_axis } = req.query;

  tautulli.getPlaysByDayOfWeek(user.plex_userid, days, y_axis)
    .then(data => res.send({
      success: true,
      data: data.response.data,
      message: 'play by day of week successfully fetched from tautulli'
    })
    )
}

function getPlaysByDaysController(req, res) {
  const user = req.loggedInUser;
  const { days, y_axis } = req.query;

  if (days === undefined) {
    return res.status(422).send({
      success: false,
      message: "Missing parameter: days (number)"
    })
  }

  const allowedYAxisDataType = ['plays', 'duration'];
  if (!allowedYAxisDataType.includes(y_axis)) {
    return res.status(422).send({
      success: false,
      message: `Y axis parameter must be one of values: [${ allowedYAxisDataType }]`
    })
  }

  tautulli.getPlaysByDays(user.plex_userid, days, y_axis)
    .then(data => res.send({
        success: true,
        data: data.response.data
      }))
}


function userViewHistoryController(req, res) {
   const user = req.loggedInUser;

   console.log('user', user)


   // TODO here we should check if we can init tau
   // and then return 501 Not implemented

   tautulli.viewHistory(user.plex_userid)
     .then(data => {
       console.log('data', data, JSON.stringify(data.response.data.data))


       return res.send({
         success: true,
         data: data.response.data.data,
         message: 'view history successfully fetched from tautulli'
       })
     })
     .catch(error => handleError(error))


   // const username = user.username;
}

module.exports = {
  watchTimeStatsController,
  getPlaysByDaysController,
  getPlaysByDayOfWeekController,
  userViewHistoryController
};
