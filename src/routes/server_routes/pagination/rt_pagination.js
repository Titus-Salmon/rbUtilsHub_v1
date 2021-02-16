import catapultResArrCache from "../../../nodeCacheStuff/cache1"

export async function get(req, res, next) {

  let catapultResArr_pagin = []

  //[1] take URLforWhatPageToDisplay, and extract the page # to display
  let page = parseInt(decodeURIComponent(req.query.page))
  // let tableName = decodeURIComponent(req.query.tableName)
  // let numQueryRes = decodeURIComponent(req.query.numQueryRes)

  // let offset = page * numQueryRes

  let offset = page * 100


  //[2] take page # to display, and extract relevant entries from cached catapultResArr (nodeCacheStuff)
  //i.e., if we're going to display page #2, we display "rows" 101-200 from tha array (elements 100-199)

  //V// access CACHEd V_INVENTORYMASTER QUERY RESULTS from BACKEND //////////////////////////////////////////////////////////////////////////////
  console.log(`catapultResArrCache['data']['catapultResArrCache_key']['v'].length==> ${catapultResArrCache['data']['catapultResArrCache_key']['v'].length}`)
  console.log(`catapultResArrCache['data']['catapultResArrCache_key']['v'][0]==> ${catapultResArrCache['data']['catapultResArrCache_key']['v'][0]}`)
  console.log(`JSON.stringify(catapultResArrCache['data']['catapultResArrCache_key']['v'][0])==> ${JSON.stringify(catapultResArrCache['data']['catapultResArrCache_key']['v'][0])}`)
  //^// access CACHEd V_INVENTORYMASTER QUERY RESULTS from BACKEND //////////////////////////////////////////////////////////////////////////////

  let totalRows = catapultResArrCache['data']['catapultResArrCache_key']['v'].length
  let numPgs = totalRows / 100

  for (let i = 0; i < 100; i++) {
    catapultResArr_pagin.push(catapultResArrCache['data']['catapultResArrCache_key']['v'][offset + i])
    console.log(`catapultResArr_pagin.push(catapultResArrCache['data']['catapultResArrCache_key']['v'][offset + i])==> 
    ${catapultResArr_pagin.push(catapultResArrCache['data']['catapultResArrCache_key']['v'][offset + i])}`)
  }

  //[3] send those entries from the backend (here) to the frontend via a res.json()
  res.json({
    catapultResArr_pagin: catapultResArr_pagin,
    currentPage: page //etc...
  })
}