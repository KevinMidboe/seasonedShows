// TODO : test title and date are valid matches to columns in the database
const validSortParams = ['title', 'date']
const validSortDirs = ['asc', 'desc']
const validFilterParams = ['movie', 'show', 'seeding', 'downloading', 'paused', 'finished', 'downloaded']

function validSort(by, direction) {
  return new Promise((resolve, reject) => {
    if (by === undefined) {
      resolve()
    }

    if (validSortParams.includes(by) && validSortDirs.includes(direction)) {
      resolve()
    } else {
      reject(new Error(`invalid sort parameter, must be of: ${validSortParams} with optional sort directions: ${validSortDirs} appended with ':'`))
    }
  });
}

function validFilter(filter_param) {
  return new Promise((resolve, reject) => {
     if (filter_param === undefined) {
      resolve()
    }

    if (filter_param && validFilterParams.includes(filter_param)) {
      resolve()
    } else {
      reject(new Error(`filter parameteres must be of type: ${validFilterParams}`))
    }
  });
}

module.exports = { validSort, validFilter }