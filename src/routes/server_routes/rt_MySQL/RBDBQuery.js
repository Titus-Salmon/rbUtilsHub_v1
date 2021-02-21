const mysql = require('mysql');
const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB
})
import rbDBresArrCache from "../../../nodeCacheStuff/cache1"

export async function post(req, res, next) {
  console.log(`hello from within the async function of v_InventoryMasterQuery.js`)

  res.setHeader('Content-Type', 'application/json')
  console.log(`req.body.data==> ${req.body.data}`)
  let RBDbQuery = req.body.data

  let rbDBresArr = [] //array that holds all query results Objs
  let rbDBresArr_1stPage = [] //array that holds 1st page of query results Objs
  var srcRsXLS_tsql = [] //array that holds all query results Objs for generating excel files. Do we need a separate array for this?
  //maybe not, but keeping it this way, in case we need it to be separate from rbDBresArr in the future. Just cleaner to handle
  //it this way.

  let totalPages

  async function rbDBqueryResults(result) {
    let queriedColumns = Object.keys(result[0])
    console.log(`queriedColumns==> ${queriedColumns}`)

    for (let i = 0; i < result.length; i++) { //we are abstracting query result handling here, in order to be able to provide
      //front-end results for any columns that are queried, not just a fixed set of columns 
      let rowData = result[i] //data from row #i
      let rbDBresObj = {}
      rbDBresObj['ri_t0d'] = i + 1
      for (let j = 0; j < queriedColumns.length; j++) {
        let colName = queriedColumns[j]

        if (colName.toLowerCase() === 'pos_timeStamp') {
          rbDBresObj[`${colName}`] = unescape(rowData[`${colName}`])
        }
        if (typeof rowData[`${colName}`] === 'string' &&
          rowData[`${colName}`] !== '') {
          rbDBresObj[`${colName}`] = rowData[`${colName}`].trim()
        } else {
          rbDBresObj[`${colName}`] = rowData[`${colName}`]
        }
        if (colName.toLowerCase() === 'sib_idealmargin') { //calculates actual margin, and adds that row to result set
          rbDBresObj['actlMarg'] = Math.round(((rowData['sib_baseprice'] - rowData['inv_lastcost']) / (rowData['sib_baseprice'])) * 100)
        }
      }
      rbDBresArr.push(rbDBresObj)
      srcRsXLS_tsql.push(rbDBresObj)
    }

    if (rbDBresArr.length > 100) { //if there are more than 100 query results, only push the 1st 100 into the 1st page
      //result set (rbDBresArr_1stPage)
      for (let i = 0; i < 100; i++) {
        rbDBresArr_1stPage.push(rbDBresArr[i])
      }
    } else {
      rbDBresArr_1stPage = rbDBresArr //if there are 100 or less total query results, the 1st page results are set equal
      //to the whole query result dataset (rbDBresArr)
    }

    //V// CACHE V_INVENTORYMASTER QUERY RESULTS IN BACKEND (for saveToCSV, and possibly other things)//////////////////////////////////////////////////////////////////////////////
    rbDBresArrCache.set('rbDBresArrCache_key', rbDBresArr)
    console.log(`rbDBresArrCache['data']['rbDBresArrCache_key']['v'].length==> ${rbDBresArrCache['data']['rbDBresArrCache_key']['v'].length}`)
    console.log(`rbDBresArrCache['data']['rbDBresArrCache_key']['v'][0]==> ${rbDBresArrCache['data']['rbDBresArrCache_key']['v'][0]}`)
    console.log(`JSON.stringify(rbDBresArrCache['data']['rbDBresArrCache_key']['v'][0])==> ${JSON.stringify(rbDBresArrCache['data']['rbDBresArrCache_key']['v'][0])}`)
    //^// CACHE V_INVENTORYMASTER QUERY RESULTS IN BACKEND //////////////////////////////////////////////////////////////////////////////
  }

  async function paginCalcs() { //we are hard-coding page length to 100 results per page for now
    totalPages = Math.ceil(rbDBresArr.length / 100)
  }

  odbc.connect(DSN, (error, connection) => {
    connection.query(`${RBDbQuery}`, (error, result) => {
      if (error) {
        console.error(error)
      }
      rbDBqueryResults(result).then(paginCalcs()).then(() => {
        res.json({
          rbDBresArr: rbDBresArr, //this is the entire result set (which we actually may not need to be passing to the front)
          rbDBresArr_1stPage: rbDBresArr_1stPage, //this is the 1st page of results, showing the 1st 100 rows
          // "rbDBresArr_pagin": rbDBresArr_pagin, //this is whatever page of results we're cal;ing, based on pagination
          totalPages: totalPages,
          currentPage: 1, //set  currentPage to 1 for initial query response, since we'll be on the 1st page
          // nextPage: 1,
          // prevPage: null
        })
      })
    })
  })
}