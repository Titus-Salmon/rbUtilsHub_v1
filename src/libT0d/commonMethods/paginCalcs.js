let totalPages
let queryResArr = []
async function paginCalcs(queryResArr) { //we are hard-coding page length to 100 results per page for now
  totalPages = Math.ceil(queryResArr.length / 100)
}

export {
  totalPages,
  queryResArr,
  paginCalcs
}