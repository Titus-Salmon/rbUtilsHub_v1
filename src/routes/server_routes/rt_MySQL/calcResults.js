const mysql = require('mysql')
const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
})

import save_imw_CSV_cache from "../../../nodeCacheStuff/cache1"

import {
  totalPages,
  paginCalcs
} from "../../../libT0d/commonMethods/paginCalcs"

import {
  rbDBqueryResults
} from "../../../libT0d/MySQL/rbDBqueryResults"

import {
  blank_imw_creator,
} from "../../../libT0d/imw/blank_imw_creator"

import {
  discoMulti_WS,
  ongDiscoMulti_WS
} from "../../../libT0d/calcResults/ongDiscoMulti_WS"

import {
  unitCost,
  eaCsNumDiv
} from "../../../libT0d/calcResults/eaCsNumDiv"

import {
  nmPk,
  numPkgsCalc
} from "../../../libT0d/calcResults/numPkgsCalc"

import {
  csPk,
  ovr,
  csPkMltCalc
} from "../../../libT0d/calcResults/csPkMltCalc"

import {
  wholesaleCalcs
} from "../../../libT0d/calcResults/wholesaleCalcs"

import {
  retailCalcs
} from "../../../libT0d/calcResults/retailCalcs"

export async function post(req, res, next) {

  console.log(`h4ll0 from within the async function of calcResults.js`)

  res.setHeader('Content-Type', 'application/json')

  let stagedTableName = req.body.tableName
  console.log(`JSON.stringify(req.body)==> ${JSON.stringify(req.body)}`)
  console.log(`stagedTableName==> ${stagedTableName}`)

  let queryResArr = []
  let modifiedQueryResArr = []
  let srcRsXLS = []
  let queryResArr_1stPage = []
  let populated_imw_arr = []
  let calcResStatus

  //need to distinguish between Rtl and WS IMWs, so will need separate populateIMW functions. 
  //Need to grab ahold of incoming form data from stagedDataModal.svelte in order to tell which type of IMW is intended...

  async function populateIMW() {

    if (req.body.typeOfIMW === "wholesale") {
      wholesaleCalcs(req.body, queryResArr, populated_imw_arr, modifiedQueryResArr, calcResStatus)
    } else {
      retailCalcs(req.body, queryResArr, populated_imw_arr, modifiedQueryResArr, calcResStatus)
    }
    // JSON.stringify(req.body)==> 
    //{"tableName":"nejgarden20210227",
    //"beerAlc":"20","bodyCare":"45","books":"40","bulk":"45","bulkHerbPrepack":"45","cbdGroc":"45","cbdSupp":"45","cbdTop":"45",
    //"consignments":"20","genMerch":"38","gift":"50","grabGo":"33","grocery":"38","groceryLocal":"33","groceryLocalMeat":"25",
    //"hba":"45","herbsHomeo":"40","lifeBar":"0","other":"45","petSupplies":"38","refrigerated":"33","vitSupp":"40",

    //"lowerCutoffRqdRtlGroc":"2",
    //"lowerCutoffCharmGroc1":"0.19","lowerCutoffCharmGroc2":"0.29","lowerCutoffCharmGroc3":"0.39","lowerCutoffCharmGroc4":"0.49",
    //"lowerCutoffCharmGroc5":"0.59","lowerCutoffCharmGroc6":"0.79","lowerCutoffCharmGroc7":"0.99",

    //"upperCutoffRqdRtlGroc":"12",
    //"defaultCharmGroc1":"0.29","defaultCharmGroc2":"0.49","defaultCharmGroc3":"0.79","defaultCharmGroc4":"0.99",

    //"lowerCutoffRqdRtlWell":"10",
    //"lowerCutoffCharmWell1":"0.29","lowerCutoffCharmWell2":"0.29","lowerCutoffCharmWell3":"0.49","lowerCutoffCharmWell4":"0.49",
    //"lowerCutoffCharmWell5":"0.79","lowerCutoffCharmWell6":"0.79","lowerCutoffCharmWell7":"0.99",

    //"upperCutoffRqdRtlWell":"9999",
    //"defaultCharmWell1":"0.49","defaultCharmWell2":"0.49","defaultCharmWell3":"0.99","defaultCharmWell4":"0.99",

    //"ongDisco_WS":"","ongDisco_Rtl":"",
    //"eaNumDivide":"no","csNumDivide":"",
    //"typeOfIMW":"wholesale",
    //"skuMismatchAllowance":"allowMismatch",
    //"ediOrCatapultSku":"catapult",
    //"flagSkuMismatch":"yes",
    //"includeEdlp":"no",
    //"deptFilter":"none"}

    //V// CACHE populateIMW RESULTS IN BACKEND (for saveToCSV, and possibly other things)//////////////////////////////////////////////////////////////////////////////
    save_imw_CSV_cache.set('save_imw_CSV_cache_key', populated_imw_arr)
    console.log(`save_imw_CSV_cache['data']['save_imw_CSV_cache_key']['v'].length==> ${save_imw_CSV_cache['data']['save_imw_CSV_cache_key']['v'].length}`)
    console.log(`save_imw_CSV_cache['data']['save_imw_CSV_cache_key']['v'][0]==> ${save_imw_CSV_cache['data']['save_imw_CSV_cache_key']['v'][0]}`)
    console.log(`JSON.stringify(save_imw_CSV_cache['data']['save_imw_CSV_cache_key']['v'][0])==> ${JSON.stringify(save_imw_CSV_cache['data']['save_imw_CSV_cache_key']['v'][0])}`)
    console.log(`JSON.stringify(save_imw_CSV_cache['data']['save_imw_CSV_cache_key']['v'][1])==> ${JSON.stringify(save_imw_CSV_cache['data']['save_imw_CSV_cache_key']['v'][1])}`)
    //^// CACHE populateIMW RESULTS IN BACKEND //////////////////////////////////////////////////////////////////////////////
  }

  connection.query(
    `SELECT * FROM ${stagedTableName} 
    WHERE dpt_name != 'RB_CLEANUP' 
    GROUP BY inv_ScanCode, inv_lastcost 
    ORDER BY
    dpt_name ASC, pi1_description ASC, pi1_description ASC;
    `,
    function (err, rows, fields) {
      if (err) throw err
      console.log(`rows.length==>${rows.length}`)
      console.log('rows[0]==>', rows[0])
      rbDBqueryResults(rows, queryResArr, srcRsXLS, queryResArr_1stPage) //queryResArr gets populated and cached with
        //the query results from the above query
        .then(populateIMW())
        .then(paginCalcs(modifiedQueryResArr)) //however, we only want to show the results for items that need wholesale
        //or retail updates, therefore, we only do our pagination (and subsequent display) for items that meet these
        //criteria. These items are kept in the modifiedQueryResArr
        .then(() => {
          res.json({
            // queryResArr: queryResArr, //this is the entire result set (which we actually may not need to be passing to the front)
            queryResArr_1stPage: queryResArr_1stPage, //this is the 1st page of results, showing the 1st 100 rows
            // "queryResArr_pagin": queryResArr_pagin, //this is whatever page of results we're cal;ing, based on pagination
            totalPages: totalPages,
            currentPage: 1, //set  currentPage to 1 for initial query response, since we'll be on the 1st page
            // populated_imw: populated_imw,
            // populated_imw_arr: populated_imw_arr,
            calcResStatus: calcResStatus, //right now we're not using this in the front end, but we probably should in order to help
            //out with notification of when we return an empty result because no items are in need of updating
            modifiedQueryResArr: modifiedQueryResArr
          })
        })
    })
}