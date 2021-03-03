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
  imwToPop
} from "../../../libT0d/imw/blank_imw_creator"

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////V// ************* PREPARE TO REWRITE THE FUCK OUT OF THIS ***************** //////////////////////////////////////
export async function post(req, res, next) {

  console.log(`h4ll0 from within the async function of calcResults.js`)

  res.setHeader('Content-Type', 'application/json')

  let stagedTableName = req.body.tableName
  console.log(`JSON.stringify(req.body)==> ${JSON.stringify(req.body)}`)
  console.log(`stagedTableName==> ${stagedTableName}`)

  let venCatPrefix = req.body.venCatPrefix

  // blank_imw_creator()

  let queryResArr = []
  let srcRsXLS = []
  let queryResArr_1stPage = []
  let populated_imw_arr = []

  //need to distinguish between Rtl and WS IMWs, so will need separate populateIMW functions. 
  //Need to grab ahold of incoming form data from stagedDataModal.svelte in order to tell which type of IMW is intended...

  async function populateIMW() {

    if (req.body.typeOfIMW === "wholesale") {
      wholesaleCalcs()
    } else {
      retailCalcs()
    }

    function wholesaleCalcs() {
      //populate imw with wholesales from vendor-supplied catalog
      //(this is just a starting point; we will massage these values later)

      //the following fields need to be populated for WS IMW:
      //Item ID(UPC), Last Cost, Ideal Margin(?), Supplier Unit ID(SKU), Supplier ID(EDI-VENDORNAME), Num Pkgs,
      //Case Pk Mult, Ovr, PF1, PF2, PF5(YYYY-MM-DD WS UPDT(pf5)), PF6(EDI-VENDORNAME)

      //lay out logic for
      //[1] wholesale calcs, taking into account:
      //any ongoing discos
      let discoMulti;
      (function discoMulti() {
        if (req.body.ongDisco_WS !== null) {
          //if there is a disco, apply it to get the actual cost
          discoMulti = req.body.ongDisco_WS
        } else {
          //if there is no disco, just use 0 as the multiplier, so as not to change the base vendor cost
          discoMulti = 0
        }
      }())

      //ea/cs division to get to unit cost (use Catapult oup_name vals to calc)
      let eaCsNum;
      let venCost;
      let unitCost;

      function eaCsNumDiv(n) {
        eaCsNum = queryResArr[n]['oup_name'].split('-')[1]
        venCost = queryResArr[n][`${venCatPrefix}_cost`]
        if (req.body.eaCsNumDivide === 'yes') {
          //domathToGetToUnitCost
          //unitCost = vendorCost/eaCsNum
          unitCost = (venCost / eaCsNum) - (venCost / eaCsNum) * discoMulti
        } else {
          unitCost = venCost - venCost * discoMulti
        }
      }

      //[2] Num Pkgs ("Quantity" in WebOffice) - corresponds to CS-##

      //[3] Case Pk Mult ("Case Pack Multiple" in WebOffice) - corresponds to EA-##
      //Set Ovr variable to "1" for such items (allow override)


      console.log(`queryResArr.length from populateIMW()==> ${queryResArr.length}`)
      for (let i = 0; i < queryResArr.length; i++) {
        eaCsNumDiv(i)
        let imwToPop = {}
        blank_imw_creator(imwToPop)
        imwToPop['upc'] = `${queryResArr[i]['inv_ScanCode']}`
        imwToPop['sugstdRtl'] = ""
        // imwToPop['lastCost'] = `${queryResArr[i][`${venCatPrefix}_cost`]}`
        imwToPop['lastCost'] = `${unitCost}`
        imwToPop['charm'] = ""
        imwToPop['autoDiscount'] = ""
        imwToPop['idealMarg'] = `${queryResArr[i]['sib_idealmargin']}`
        imwToPop['wtPrfl'] = ""
        imwToPop['tax1'] = ""
        imwToPop['tax2'] = ""
        imwToPop['tax3'] = ""
        imwToPop['spclTndr1'] = ""
        imwToPop['spclTndr2'] = ""
        imwToPop['posPrmpt'] = ""
        imwToPop['lctn'] = ""
        imwToPop['altID'] = ""
        imwToPop['altRcptAlias'] = ""
        imwToPop['pkgQnt'] = ""
        imwToPop['imwSKU'] = `${queryResArr[i]['ord_supplierstocknumber']}`
        imwToPop['splrID'] = `${queryResArr[i]['ven_companyname']}`
        imwToPop['unit'] = ""
        imwToPop['numPkgs'] = ""
        imwToPop['pf1'] = `${queryResArr[i]['pi1_description']}`
        imwToPop['pf2'] = `${queryResArr[i]['pi2_description']}`
        imwToPop['pf3'] = ""
        imwToPop['pf4'] = ""
        imwToPop['pf5'] = `${new Date().toISOString().split('T', 1)[0]} WS UPDT (pf5)` //Power Field 5 - today's date
        imwToPop['pf6'] = `${queryResArr[i]['ven_companyname']}`
        imwToPop['pf7'] = ""
        imwToPop['pf8'] = ""
        imwToPop['onhndQnt'] = ""
        imwToPop['rdrPnt'] = ""
        imwToPop['mcl'] = ""
        imwToPop['rdrQnt'] = ""
        imwToPop['memo'] = ""
        imwToPop['flrRsn'] = ""
        imwToPop['dsd'] = ""
        imwToPop['dscMltplr'] = ""
        imwToPop['csPkgMltpl'] = ""
        imwToPop['ovr'] = ""

        populated_imw_arr.push(imwToPop)
      }
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

    //retail charm calcs are based on the following logic:
    // if (reqdRetail<lowerCutRqdRtl) {
    //   perform lower cutoff charm calcs
    // } else {
    //   if (reqdRetail<upperCharmRqdRtl) {
    //     perform upper cutoff charm calcs
    //   } else {
    //     use the defaultcharm4 calcs
    //   }
    // }




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
      rbDBqueryResults(rows, queryResArr, srcRsXLS, queryResArr_1stPage) //queryResArr gets populated and cached with
        //the query results from the above query
        .then(paginCalcs(queryResArr))
        .then(populateIMW())
        .then(() => {
          res.json({
            queryResArr: queryResArr, //this is the entire result set (which we actually may not need to be passing to the front)
            queryResArr_1stPage: queryResArr_1stPage, //this is the 1st page of results, showing the 1st 100 rows
            // "queryResArr_pagin": queryResArr_pagin, //this is whatever page of results we're cal;ing, based on pagination
            totalPages: totalPages,
            currentPage: 1, //set  currentPage to 1 for initial query response, since we'll be on the 1st page
            // populated_imw: populated_imw,
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