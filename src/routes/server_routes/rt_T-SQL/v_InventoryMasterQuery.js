const odbc = require('odbc')
const DSN = process.env.ODBC_CONN_STRING
import catapultResArrCache from "../../../nodeCacheStuff/cache1"

export async function post(req, res, next) {
  console.log(`hello from within the async function of v_InventoryMasterQuery.js`)

  res.setHeader('Content-Type', 'application/json')
  console.log(`req.body.data==> ${req.body.data}`)
  let catapultDbQuery = req.body.data

  let catapultResArr = [] //array that holds all query results Objs
  let catapultResArr_1stPage = [] //array that holds 1st page of query results Objs
  var srcRsXLS_tsql = [] //array that holds all query results Objs for generating excel files. Do we need a separate array for this?
  //maybe not, but keeping it this way, in case we need it to be separate from catapultResArr in the future. Just cleaner to handle
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
      catapultResArr.push(catapultResObj)
      srcRsXLS_tsql.push(catapultResObj)
    }

    if (catapultResArr.length > 100) { //if there are more than 100 query results, only push the 1st 100 into the 1st page
      //result set (catapultResArr_1stPage)
      for (let i = 0; i < 100; i++) {
        catapultResArr_1stPage.push(catapultResArr[i])
      }
    } else {
      catapultResArr_1stPage = catapultResArr //if there are 100 or less total query results, the 1st page results are set equal
      //to the whole query result dataset (catapultResArr)
    }

    //V// CACHE V_INVENTORYMASTER QUERY RESULTS IN BACKEND (for saveToCSV, and possibly other things)//////////////////////////////////////////////////////////////////////////////
    catapultResArrCache.set('catapultResArrCache_key', catapultResArr)
    console.log(`catapultResArrCache['data']['catapultResArrCache_key']['v'].length==> ${catapultResArrCache['data']['catapultResArrCache_key']['v'].length}`)
    console.log(`catapultResArrCache['data']['catapultResArrCache_key']['v'][0]==> ${catapultResArrCache['data']['catapultResArrCache_key']['v'][0]}`)
    console.log(`JSON.stringify(catapultResArrCache['data']['catapultResArrCache_key']['v'][0])==> ${JSON.stringify(catapultResArrCache['data']['catapultResArrCache_key']['v'][0])}`)
    //^// CACHE V_INVENTORYMASTER QUERY RESULTS IN BACKEND //////////////////////////////////////////////////////////////////////////////
  }

  async function paginCalcs() { //we are hard-coding page length to 100 results per page for now
    totalPages = Math.ceil(catapultResArr.length / 100)
  }

  odbc.connect(DSN, (error, connection) => {
    connection.query(`${catapultDbQuery}`, (error, result) => {
      if (error) {
        console.error(error)
      }
      showcatapultResults(result).then(paginCalcs()).then(() => {
        res.json({
          "catapultResArr": catapultResArr, //this is the entire result set (which we actually may not need to passing to the front)
          "catapultResArr_1stPage": catapultResArr_1stPage, //this is the 1st page of results, showing the 1st 100 rows
          "totalPages": totalPages
        })
      })
    })
  })
}