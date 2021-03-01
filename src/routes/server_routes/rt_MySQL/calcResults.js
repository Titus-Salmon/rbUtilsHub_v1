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
  blank_imw
} from "../../../libT0d/imw/blank_imw"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////V// ************* PREPARE TO REWRITE THE FUCK OUT OF THIS ***************** //////////////////////////////////////
export async function post(req, res, next) {

  console.log(`h4ll0 from within the async function of calcResults.js`)

  res.setHeader('Content-Type', 'application/json')

  let stagedTableName = req.body.tableName
  console.log(`JSON.stringify(req.body)==> ${JSON.stringify(req.body)}`)
  console.log(`stagedTableName==> ${stagedTableName}`)

  let queryResArr = []
  let srcRsXLS = []
  let queryResArr_1stPage = []
  let populated_imw = blank_imw
  let populated_imw_arr = []

  function populateIMW(populated_imw) {
    console.log(`queryResArr.length from populateIMW()==> ${queryResArr.length}`)
    for (let i = 0; i < queryResArr.length; i++) {
      populated_imw['upc'] = queryResArr[i]['inv_ScanCode']
      console.log(`populated_imw['upc']==> ${populated_imw['upc']}`)
      console.log(`queryResArr[i]['inv_ScanCode']==> ${queryResArr[i]['inv_ScanCode']}`)
      populated_imw_arr.push(populated_imw)
    }

    console.log(JSON.stringify(populated_imw_arr))
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
    WHERE dpt_name != 'RB_CLEANUP' GROUP BY inv_ScanCode,
    inv_lastcost ORDER BY
    dpt_name ASC, pi1_description ASC, pi1_description ASC;
    `,
    function (err, rows, fields) {
      if (err) throw err
      console.log(`rows.length==>${rows.length}`)
      console.log('rows[0]==>', rows[0])
      rbDBqueryResults(rows, queryResArr, srcRsXLS, queryResArr_1stPage)
        .then(paginCalcs(queryResArr))
        .then(populateIMW(...populated_imw))
        .then(() => {
          res.json({
            queryResArr: queryResArr, //this is the entire result set (which we actually may not need to be passing to the front)
            queryResArr_1stPage: queryResArr_1stPage, //this is the 1st page of results, showing the 1st 100 rows
            // "queryResArr_pagin": queryResArr_pagin, //this is whatever page of results we're cal;ing, based on pagination
            totalPages: totalPages,
            currentPage: 1, //set  currentPage to 1 for initial query response, since we'll be on the 1st page
            populated_imw: populated_imw,
            populated_imw_arr: populated_imw_arr
          })
        })
    })

  // //v//retrieve info from database table to display in DOM table/////////////////////////////////////////////////////////
  // //filters by UPC & catapult cost (want to grab any differing cost items & make decision on what to do in showSearchResults())
  // connection.query( //1st query is pagination query; 2nd query is getting EDLP data; 3rd query is non-paginated query;
  //   //4th query is for getting COUNT (# of total rows)
  //   `SELECT * FROM ${frmInptsObj.formInput0}
  //       WHERE dptName != 'RB_CLEANUP' GROUP BY ${genericHeaderObj.upcHeader},
  //     ${genericHeaderObj.invLastcostHeader} ORDER BY
  //     ${genericHeaderObj.rbDeptHeader} ASC, ${genericHeaderObj.pi1Description} ASC, ${genericHeaderObj.pi2Description} ASC
  //     LIMIT ${paginPostObj['offsetPost']},${paginPostObj['numQueryRes']};

  //     SELECT * FROM rb_edlp_data;

  //     SELECT * FROM ${frmInptsObj.formInput0}
  //     WHERE dptName != 'RB_CLEANUP' GROUP BY ${genericHeaderObj.upcHeader},
  //     ${genericHeaderObj.invLastcostHeader} ORDER BY
  //     ${genericHeaderObj.rbDeptHeader} ASC, ${genericHeaderObj.pi1Description} ASC, ${genericHeaderObj.pi2Description} ASC;

  //     SELECT COUNT(*) FROM ${frmInptsObj.formInput0};

  //     SELECT * FROM gpet_groc;
  //     SELECT * FROM gpet_ref;
  //     SELECT * FROM gpet_frz;
  //     SELECT * FROM gpet_gen_merch;
  //     SELECT * FROM gpet_infra;
  //     SELECT * FROM gpet_case_stack;
  //     SELECT * FROM gpet_nego_edlp;
  //     SELECT * FROM gpet_cadia;`,

  //   function (err, rows, fields) {
  //     if (err) throw err

  //     let nejRowsPagin = rows[0] //targets 1st query on NEJ table
  //     // console.log(`nejRowsPagin[0]==> ${nejRowsPagin[0]}`)
  //     console.log(`nejRowsPagin.length (BEFORE gpet handling)==> ${nejRowsPagin.length}`)
  //     // console.log(`JSON.stringify(nejRowsPagin[0])==> ${JSON.stringify(nejRowsPagin[0])}`)
  //     let edlpRows = rows[1] //targets 2nd query on rb_edlp_data table
  //     console.log(`JSON.stringify(edlpRows[0])==> ${JSON.stringify(edlpRows[0])}`)
  //     let nejRowsNonPagin = rows[2] //targets 3rd query on NEJ table
  //     console.log(`nejRowsNonPagin.length (BEFORE gpet handling)==> ${nejRowsNonPagin.length}`)
  //     let countRows = rows[3]
  //     console.log(`JSON.stringify(countRows) from calcResults.js==> ${JSON.stringify(countRows)}`)
  //     let gpetGrocRows = rows[4]
  //     // console.log(`JSON.stringify(gpetGrocRows[0])==> ${JSON.stringify(gpetGrocRows[0])}`)
  //     let gpetRefRows = rows[5]
  //     let gpetFrzRows = rows[6]
  //     let gpetGenMerchRows = rows[7]
  //     let gpetINFRArows = rows[8]
  //     let gpetCaseStackRows = rows[9]
  //     let gpetNegoEDLProws = rows[10]
  //     let gpetCadiaRows = rows[11]

  //     //v////////handle gpet tables ==> if UPC is in gpet table, ignore it in showSearchResults calcs
  //     function gpetUPCremover(gpetTableRows) {
  //       for (let x = 0; x < gpetTableRows.length; x++) {
  //         for (let y = 0; y < nejRowsPagin.length; y++) {
  //           if (gpetTableRows[x]['upc'] == nejRowsPagin[y]['invScanCode']) {
  //             nejRowsPagin.splice(y, 1)
  //           }
  //         }
  //       }
  //       for (let x = 0; x < gpetTableRows.length; x++) {
  //         for (let y = 0; y < nejRowsNonPagin.length; y++) {
  //           if (gpetTableRows[x]['upc'] == nejRowsNonPagin[y]['invScanCode']) {
  //             nejRowsNonPagin.splice(y, 1)
  //           }
  //         }
  //       }
  //     }
  //     gpetUPCremover(gpetGrocRows)
  //     gpetUPCremover(gpetRefRows)
  //     gpetUPCremover(gpetFrzRows)
  //     gpetUPCremover(gpetGenMerchRows)
  //     gpetUPCremover(gpetINFRArows)
  //     gpetUPCremover(gpetCaseStackRows)
  //     gpetUPCremover(gpetNegoEDLProws)
  //     gpetUPCremover(gpetCadiaRows)

  //     console.log(`nejRowsPagin.length (AFTER gpet handling)==> ${nejRowsPagin.length}`)
  //     console.log(`nejRowsNonPagin.length (AFTER gpet handling)==> ${nejRowsNonPagin.length}`)
  //     //^////////handle gpet tables ==> if UPC is in gpet table, ignore it in showSearchResults calcs

  //     console.log(`nejRowsNonPagin.length (BEFORE edlpRemover())==> ${nejRowsNonPagin.length}`)

  //     function edlpRemover() {
  //       //v//EDLP REMOVER///////////////////////////////////////////////////////////////////////////////////////
  //       console.log(`JSON.stringify(nejRowsNonPagin[0])==> ${JSON.stringify(nejRowsNonPagin[0])}`)
  //       // console.log(`JSON.stringify(searchResultsNonPag[0])==> ${JSON.stringify(searchResultsNonPag[0])}`)
  //       for (let j = 0; j < edlpRows.length; j++) {
  //         for (let k = 0; k < nejRowsNonPagin.length; k++) {
  //           if (nejRowsNonPagin[k]['invScanCode'] == edlpRows[j]['edlp_upc']) {
  //             nejRowsNonPagin.splice(k, 1)
  //           }
  //         }
  //       }
  //       //^//EDLP REMOVER///////////////////////////////////////////////////////////////////////////////////////
  //     }
  //     if (frmInptsObj.edlpSwitch == 'no') {
  //       edlpRemover()
  //     }

  //     console.log(`nejRowsNonPagin.length (AFTER edlpRemover())==> ${nejRowsNonPagin.length}`)

  //     showSearchResults.showSearchResults(rows, genericHeaderObj, frmInptsObj, searchResultsNonPag, srcRsCSV_nonPag, srcRsCSVrvw_nonPag,
  //       srcRsXLS_nonPag, edlpRows, nejRowsNonPagin)

  //     function edlpAllow() {
  //       //v//ALLOW EDLP///////////////////////////////////////////////////////////////////////////////////////
  //       console.log(`JSON.stringify(searchResultsNonPag[0])==> ${JSON.stringify(searchResultsNonPag[0])}`)
  //       // console.log(`JSON.stringify(searchResultsNonPag[0])==> ${JSON.stringify(searchResultsNonPag[0])}`)
  //       for (let j = 0; j < edlpRows.length; j++) {
  //         for (let k = 0; k < searchResultsNonPag.length; k++) {
  //           if (searchResultsNonPag[k]['upc'] == edlpRows[j]['edlp_upc']) {
  //             searchResultsNonPag[k]['edlpVar'] = "EDLP"
  //           }
  //         }
  //       }
  //       //^//ALLOW EDLP///////////////////////////////////////////////////////////////////////////////////////
  //     }
  //     if (frmInptsObj.edlpSwitch == 'yes') {
  //       edlpAllow()
  //     }

  //     cacheMain.set('searchResultsNonPagCache_key', searchResultsNonPag)

  //     function paginFirstResultSet() {
  //       //push the 1st n elements of searchResultsNonPag into firstResultSet array
  //       for (let n = 0; n < paginPostObj['numQueryRes']; n++) {
  //         firstResultSet.push(searchResultsNonPag[n])
  //       }
  //     }

  //     paginFirstResultSet()

  //     console.log(`calcResults says firstResultSet.length from paginFirstResultSet==> ${firstResultSet.length}`)

  //     let totalRows = searchResultsNonPag.length //use length of non-paginated results from showSearchResults for total # of rows,
  //     console.log(`totalRows==> ${totalRows}`)
  //     //since countRows[0]['COUNT(*)'] gives 7x the actual number of rows (7 stores)
  //     totalRowsCache.set('totalRowsCache_key', totalRows)

  //     let numPages = Math.ceil(totalRows / numQueryRes) //round up to account for fractions of pages (i.e. 22.3 pages ==> 23 pages)
  //     console.log(`numPages==> ${numPages}`)
  //     numPagesPlaceholder.push(numPages)

  //     // let pageLinkObj = {}
  //     for (let j = 0; j < numPages; j++) {
  //       let pageLinkObj = {}
  //       pageLinkObj[`page${j}`] = j
  //       pageLinkArray.push(pageLinkObj)
  //     }

  //     res.render('vw-MySqlTableHub', { //render searchResults to vw-MySqlTableHub page
  //       title: `Retail Price Calculator (using nhcrtEdiJoin table: <<${frmInptsObj.loadedSqlTbl}>>)`,
  //       searchResRows: firstResultSet,
  //       loadedSqlTbl: frmInptsObj.loadedSqlTbl,
  //       numQueryRes: paginPostObj.numQueryRes,
  //       currentPage: paginPostObj.currentPage,
  //       pageLinkArray: pageLinkArray,
  //       numberOfPages: numPagesPlaceholder[0],
  //       lastPage: numPagesPlaceholder[0] - 1,
  //       firstPage: 0,
  //       tableName: frmInptsObj.formInput0,
  //       formInputsObj: frmInptsObj,
  //       upcHeader: genericHeaderObj.upcHeader,
  //       invLastcostHeader: genericHeaderObj.invLastcostHeader,
  //       searchResultsPag: searchResultsPag,
  //       searchResultsPag_stringified: JSON.stringify(searchResultsPag),
  //       offsetPost: paginPostObj.offsetPost,
  //       offsetPost: paginPostObj.offsetPost,
  //       genericHeaderObj_stringified: JSON.stringify(genericHeaderObj),
  //       formInputsObj_stringified: JSON.stringify(frmInptsObj)
  //       // ongDsc: ongDsc //use to populate value for "%Discount to Apply" field
  //     })
  //   })
  /////////^// ************* PREPARE TO REWRITE THE FUCK OUT OF THIS ***************** //////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}