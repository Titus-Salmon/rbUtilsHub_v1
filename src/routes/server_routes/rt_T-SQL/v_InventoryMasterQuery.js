const odbc = require('odbc')
const DSN = process.env.ODBC_CONN_STRING
import catapultResArrCache from "../../../nodeCacheStuff/cache1"

export async function post(req, res, next) {
  console.log(`hello from within the async function of v_InventoryMasterQuery.js`)

  res.setHeader('Content-Type', 'application/json')
  console.log(`req.body.data==> ${req.body.data}`)
  let catapultDbQuery = req.body.data

  let catapultResArr = []
  var srcRsXLS_tsql = []

  function showcatapultResults(result) {
    let queriedColumns = Object.keys(result[0])
    console.log(`queriedColumns==> ${queriedColumns}`)

    for (let i = 0; i < result.length; i++) {
      let rowData = result[i]
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
        if (colName.toLowerCase() === 'sib_idealmargin') {
          catapultResObj['actlMarg'] = Math.round(((rowData['sib_baseprice'] - rowData['inv_lastcost']) / (rowData['sib_baseprice'])) * 100)
        }
      }
      catapultResArr.push(catapultResObj)
      srcRsXLS_tsql.push(catapultResObj)
    }
    //V// CACHE V_INVENTORYMASTER QUERY RESULTS IN BACKEND (for saveToCSV, and possibly other things)//////////////////////////////////////////////////////////////////////////////
    catapultResArrCache.set('catapultResArrCache_key', catapultResArr)
    console.log(`catapultResArrCache['data']['catapultResArrCache_key']['v'].length==> ${catapultResArrCache['data']['catapultResArrCache_key']['v'].length}`)
    console.log(`catapultResArrCache['data']['catapultResArrCache_key']['v'][0]==> ${catapultResArrCache['data']['catapultResArrCache_key']['v'][0]}`)
    console.log(`JSON.stringify(catapultResArrCache['data']['catapultResArrCache_key']['v'][0])==> ${JSON.stringify(catapultResArrCache['data']['catapultResArrCache_key']['v'][0])}`)
    //^// CACHE V_INVENTORYMASTER QUERY RESULTS IN BACKEND //////////////////////////////////////////////////////////////////////////////
  }

  odbc.connect(DSN, (error, connection) => {
    connection.query(`${catapultDbQuery}`, (error, result) => {
      if (error) {
        console.error(error)
      }
      showcatapultResults(result)
      res.json(catapultResArr)
    })
  })
}