// TODO : test title and date are valid matches to columns in the database

const validSortParams = ['title', 'date']
const validSortDirections = ['asc', 'desc']
const validFilterParams = ['movie', 'show', 'seeding', 'downloading', 'paused', 'finished', 'downloaded']

function validSort(by, direction) {
   if (! validSortParams.includes(by)) {
      return false
   }
   else if (! validSortDirections.includes(direction)) {
      return false
   }
   
   return true
}

function validFilter(filter_param) {
  return validFilterParams.includes(filter_param)
}

module.exports = { validSort, validFilter }