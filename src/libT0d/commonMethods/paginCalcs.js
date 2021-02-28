async function paginCalcs(totalPages, queryResArr) { //we are hard-coding page length to 100 results per page for now
  return totalPages = Math.ceil(queryResArr.length / 100)
}

export default paginCalcs