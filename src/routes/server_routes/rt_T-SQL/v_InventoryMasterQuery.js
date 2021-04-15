const odbc = require('odbc')
const DSN = process.env.ODBC_CONN_STRING
import queryResArrCache from "../../../nodeCacheStuff/cache1"

export async function post(req, res, next) {
  console.log(`hello from within the async function of v_InventoryMasterQuery.js`)

  res.setHeader('Content-Type', 'application/json')
  console.log(`req.body.data==> ${req.body.data}`)
  let catapultDbQuery = req.body.data
  let actlMargRangeLessVal = req.body.actlMargRangeLessVal
  let actlMargRangeGreaterVal = req.body.actlMargRangeGreaterVal

  console.log(`actlMargRangeLessVal==> ${actlMargRangeLessVal}`)
  console.log(`actlMargRangeGreaterVal==> ${actlMargRangeGreaterVal}`)


  let queryResArr = [] //array that holds all query results Objs
  let queryResArr_1stPage = [] //array that holds 1st page of query results Objs
  var srcRsXLS_tsql = [] //array that holds all query results Objs for generating excel files. Do we need a separate array for this?
  //maybe not, but keeping it this way, in case we need it to be separate from queryResArr in the future. Just cleaner to handle
  //it this way.

  let totalPages

  async function showcatapultResults(result) {
    let queriedColumns = Object.keys(result[0])
    console.log(`queriedColumns==> ${queriedColumns}`)

    for (let i = 0; i < result.length; i++) { //we are abstracting query result handling here, in order to be able to provide
      //front-end results for any columns that are queried, not just a fixed set of columns 
      let rowData = result[i] //data from row #i
      let catapultResObj = {}
      catapultResObj['ri_t0d'] = i + 1
      for (let j = 0; j < queriedColumns.length; j++) {
        let colName = queriedColumns[j]

        if (colName.toLowerCase() === 'pos_timeStamp') {
          catapultResObj[`${colName}`] = unescape(rowData[`${colName}`])
        }
        if (typeof rowData[`${colName}`] === 'string' &&
          rowData[`${colName}`] !== '') {
          catapultResObj[`${colName}`] = rowData[`${colName}`].trim()
        } else {
          catapultResObj[`${colName}`] = rowData[`${colName}`]
        }
        if (colName.toLowerCase() === 'sib_idealmargin') { //calculates actual margin, and adds that row to result set
          catapultResObj['actlMarg'] = Math.round(((rowData['sib_baseprice'] - rowData['inv_lastcost']) / (rowData['sib_baseprice'])) * 100)
        }
      }
      if (actlMargRangeLessVal !== "enter value") { //if you've provided some logic via the actualMargLessRange input (i.e. '<0')
        //use that logic to filter the result set for only items that meet the actual margin criteria
        if (catapultResObj['actlMarg'] < parseFloat(actlMargRangeLessVal)) {
          queryResArr.push(catapultResObj)
          srcRsXLS_tsql.push(catapultResObj)
        }
      } else {
        if (actlMargRangeGreaterVal !== "enter value") { //if you've provided some logic via the actualMargGreaterRange input (i.e. '>0')
          //use that logic to filter the result set for only items that meet the actual margin criteria
          if (catapultResObj['actlMarg'] > parseFloat(actlMargRangeGreaterVal)) {
            queryResArr.push(catapultResObj)
            srcRsXLS_tsql.push(catapultResObj)
          }
        } else { //otherwise, display entire result set, regardless of actual margin values
          queryResArr.push(catapultResObj)
          srcRsXLS_tsql.push(catapultResObj)
        }
      }
    }

    if (queryResArr.length > 100) { //if there are more than 100 query results, only push the 1st 100 into the 1st page
      //result set (queryResArr_1stPage)
      for (let i = 0; i < 100; i++) {
        queryResArr_1stPage.push(queryResArr[i])
      }
    } else {
      queryResArr_1stPage = queryResArr //if there are 100 or less total query results, the 1st page results are set equal
      //to the whole query result dataset (queryResArr)
    }

    //V// CACHE V_INVENTORYMASTER QUERY RESULTS IN BACKEND (for saveToCSV, and possibly other things)//////////////////////////////////////////////////////////////////////////////
    queryResArrCache.set('queryResArrCache_key', queryResArr)
    console.log(`queryResArrCache['data']['queryResArrCache_key']['v'].length==> ${queryResArrCache['data']['queryResArrCache_key']['v'].length}`)
    console.log(`queryResArrCache['data']['queryResArrCache_key']['v'][0]==> ${queryResArrCache['data']['queryResArrCache_key']['v'][0]}`)
    console.log(`JSON.stringify(queryResArrCache['data']['queryResArrCache_key']['v'][0])==> ${JSON.stringify(queryResArrCache['data']['queryResArrCache_key']['v'][0])}`)
    //^// CACHE V_INVENTORYMASTER QUERY RESULTS IN BACKEND //////////////////////////////////////////////////////////////////////////////
  }

  async function paginCalcs() { //we are hard-coding page length to 100 results per page for now
    totalPages = Math.ceil(queryResArr.length / 100)
  }

  odbc.connect(DSN, (error, connection) => {
    connection.query(`${catapultDbQuery}`, (error, result) => {
      if (error) {
        console.error(error)
      }
      showcatapultResults(result).then(paginCalcs()).then(() => {
        res.json({
          queryResArr: queryResArr, //this is the entire result set (which we actually may not need to be passing to the front)
          queryResArr_1stPage: queryResArr_1stPage, //this is the 1st page of results, showing the 1st 100 rows
          // "queryResArr_pagin": queryResArr_pagin, //this is whatever page of results we're cal;ing, based on pagination
          totalPages: totalPages,
          currentPage: 1, //set  currentPage to 1 for initial query response, since we'll be on the 1st page
          // nextPage: 1,
          // prevPage: null
        })
      })
    })
  })
}