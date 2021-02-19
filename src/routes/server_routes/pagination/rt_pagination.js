import catapultResArrCache from "../../../nodeCacheStuff/cache1"

export async function get(req, res, next) {

  let catapultResArr_pagin = []

  //[1] take URLforWhatPageToDisplay, and extract the page # to display
  console.log(`req.query==> ${req.query}`)
  console.log(`req.query.page.value==> ${req.query.page.value}`)
  console.log(`JSON.stringify(req.query)==> ${JSON.stringify(req.query)}`)
  let page = parseInt(decodeURIComponent(req.query.page))
  console.log(`page==> ${page}`)

  let page_t0d = decodeURIComponent(req.query.page)
  console.log(`page_t0d==> ${page_t0d}`)

  let offset = page * 100


  //[2] take page # to display, and extract relevant entries from cached catapultResArr (nodeCacheStuff)
  //i.e., if we're going to display page #2, we display "rows" 101-200 from tha array (elements 100-199)

  //V// access CACHEd V_INVENTORYMASTER QUERY RESULTS from BACKEND //////////////////////////////////////////////////////////////////////////////
  console.log(`catapultResArrCache['data']['catapultResArrCache_key']['v'].length==> ${catapultResArrCache['data']['catapultResArrCache_key']['v'].length}`)
  console.log(`catapultResArrCache['data']['catapultResArrCache_key']['v'][0]==> ${catapultResArrCache['data']['catapultResArrCache_key']['v'][0]}`)
  console.log(`JSON.stringify(catapultResArrCache['data']['catapultResArrCache_key']['v'][0])==> ${JSON.stringify(catapultResArrCache['data']['catapultResArrCache_key']['v'][0])}`)
  //^// access CACHEd V_INVENTORYMASTER QUERY RESULTS from BACKEND //////////////////////////////////////////////////////////////////////////////

  let totalRows = catapultResArrCache['data']['catapultResArrCache_key']['v'].length
  let numPgs = Math.ceil(totalRows / 100)

  for (let i = 0; i < 100; i++) {
    if (catapultResArrCache['data']['catapultResArrCache_key']['v'][offset + i] !== undefined) {
      catapultResArr_pagin.push(catapultResArrCache['data']['catapultResArrCache_key']['v'][offset + i])
      console.log(`catapultResArrCache['data']['catapultResArrCache_key']['v'][${offset + i}]==> 
      ${catapultResArrCache['data']['catapultResArrCache_key']['v'][offset + i]}`)
    }
  }

  //[3] send those entries from the backend (here) to the frontend via a res.json()
  res.json({
    catapultResArr_pagin: catapultResArr_pagin,
    totalPages: numPgs,
    currentPage: page,
    // nextPage: page + 1,
    // prevPage: page - 1,
  })
}