const mysql = require("mysql");
const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true, //MUST HAVE to make more than 1 sql statement in a single query
});

import save_imw_CSV_cache from "../../../nodeCacheStuff/cache1";

import {
  totalPages,
  paginCalcs,
} from "../../../libT0d/commonMethods/paginCalcs";

import { rbDBqueryResults } from "../../../libT0d/MySQL/rbDBqueryResults";
import { wholesaleCalcs } from "../../../libT0d/calcResults/wholesaleCalcs";

import { retailCalcs } from "../../../libT0d/calcResults/retailCalcs";

export async function post(req, res, next) {
  console.log(`h4ll0 from within the async function of calcResults.js`);

  res.setHeader("Content-Type", "application/json");

  let stagedTableName = req.body.tableName;
  console.log(`JSON.stringify(req.body)==> ${JSON.stringify(req.body)}`);
  console.log(`stagedTableName==> ${stagedTableName}`);

  let queryResArr = [];
  let modifiedQueryResArr = [];
  let srcRsXLS = [];
  let queryResArr_1stPage = [];
  let populated_imw_arr = [];
  let calcResStatus;

  //need to distinguish between Rtl and WS IMWs, so will need separate populateIMW functions.
  //Need to grab ahold of incoming form data from stagedDataModal.svelte in order to tell which type of IMW is intended...

  async function populateIMW() {
    if (req.body.typeOfIMW === "wholesale") {
      wholesaleCalcs(
        req.body,
        queryResArr,
        populated_imw_arr,
        modifiedQueryResArr,
        calcResStatus
      );
    } else {
      retailCalcs(
        req.body,
        queryResArr,
        populated_imw_arr,
        modifiedQueryResArr,
        calcResStatus
      );
    }

    //V// CACHE populateIMW RESULTS IN BACKEND (for saveToCSV, and possibly other things)//////////////////////////////////////////////////////////////////////////////
    save_imw_CSV_cache.set("save_imw_CSV_cache_key", populated_imw_arr);
    console.log(
      `save_imw_CSV_cache['data']['save_imw_CSV_cache_key']['v'].length==> ${save_imw_CSV_cache["data"]["save_imw_CSV_cache_key"]["v"].length}`
    );
    console.log(
      `save_imw_CSV_cache['data']['save_imw_CSV_cache_key']['v'][0]==> ${save_imw_CSV_cache["data"]["save_imw_CSV_cache_key"]["v"][0]}`
    );
    console.log(
      `JSON.stringify(save_imw_CSV_cache['data']['save_imw_CSV_cache_key']['v'][0])==> ${JSON.stringify(
        save_imw_CSV_cache["data"]["save_imw_CSV_cache_key"]["v"][0]
      )}`
    );
    console.log(
      `JSON.stringify(save_imw_CSV_cache['data']['save_imw_CSV_cache_key']['v'][1])==> ${JSON.stringify(
        save_imw_CSV_cache["data"]["save_imw_CSV_cache_key"]["v"][1]
      )}`
    );
    //^// CACHE populateIMW RESULTS IN BACKEND //////////////////////////////////////////////////////////////////////////////
  }

  connection.query(
    //1st query gets data from nej table

    //2nd query gets data from rb_edlp_data table **need to exclude Gaia entries as Gaia no longer has EDLPs
    //SELECT * FROM rb_edlp_data;

    //3rd query gets data from all the grocery price exceptions tables
    // SELECT * FROM gpet_groc;
    // SELECT * FROM gpet_ref;
    // SELECT * FROM gpet_frz;
    // SELECT * FROM gpet_gen_merch;
    // SELECT * FROM gpet_infra;
    // SELECT * FROM gpet_case_stack;
    // SELECT * FROM gpet_nego_edlp;
    // SELECT * FROM gpet_cadia;

    //******************************************************************************************************** */
    //may need to add in the 2nd and 3rd queries, depending on what Nathan comes back with regarding my questions
    //******************************************************************************************************** */

    `SELECT * FROM ${stagedTableName} 
    WHERE dpt_name != 'RB_CLEANUP' 
    GROUP BY inv_ScanCode, inv_lastcost 
    ORDER BY
    dpt_name ASC, pi1_description ASC, pi1_description ASC;

    SELECT * FROM rb_edlp_data;

    SELECT * FROM gpet_groc;
    SELECT * FROM gpet_ref;
    SELECT * FROM gpet_frz;
    SELECT * FROM gpet_gen_merch;
    SELECT * FROM gpet_infra;
    SELECT * FROM gpet_case_stack;
    SELECT * FROM gpet_nego_edlp;
    SELECT * FROM gpet_cadia;
    `,
    function (err, rows, fields) {
      // if (err) throw err;
      if (err) {
        console.err(err);
        res.json({
          error: `err from calcResults.js==> ${err}`,
        });
      }
      console.log(`rows.length==>${rows.length}`);
      let calcResRows = rows[0];
      console.log(
        "JSON.stringify(calcResRows[0])==>",
        JSON.stringify(calcResRows[0])
      );

      let edlpRows = rows[1]; //targets 2nd query on rb_edlp_data table
      console.log(
        `JSON.stringify(edlpRows[0])==> ${JSON.stringify(edlpRows[0])}`
      );
      let gpetGrocRows = rows[2];
      let gpetRefRows = rows[3];
      let gpetFrzRows = rows[4];
      let gpetGenMerchRows = rows[5];
      let gpetINFRArows = rows[6];
      let gpetCaseStackRows = rows[7];
      let gpetNegoEDLProws = rows[8];
      let gpetCadiaRows = rows[9];

      //v////////handle gpet tables ==> if UPC is in gpet table, ignore it in showSearchResults calcs
      function gpetUPCremover(gpetTableRows) {
        for (let x = 0; x < gpetTableRows.length; x++) {
          for (let y = 0; y < calcResRows.length; y++) {
            if (gpetTableRows[x]["upc"] == calcResRows[y]["inv_ScanCode"]) {
              //only using == here, in case one source has
              //integers for UPC, but the other has strings
              calcResRows.splice(y, 1);
            }
          }
        }
      }
      gpetUPCremover(gpetGrocRows);
      gpetUPCremover(gpetRefRows);
      gpetUPCremover(gpetFrzRows);
      gpetUPCremover(gpetGenMerchRows);
      gpetUPCremover(gpetINFRArows);
      gpetUPCremover(gpetCaseStackRows);
      gpetUPCremover(gpetNegoEDLProws);
      gpetUPCremover(gpetCadiaRows);

      function edlpRemover() {
        //v//EDLP REMOVER///////////////////////////////////////////////////////////////////////////////////////
        for (let j = 0; j < edlpRows.length; j++) {
          for (let k = 0; k < calcResRows.length; k++) {
            if (calcResRows[k]["invScanCode"] == edlpRows[j]["edlp_upc"]) {
              calcResRows.splice(k, 1);
            }
          }
        }
        //^//EDLP REMOVER///////////////////////////////////////////////////////////////////////////////////////
      }
      if (req.body.includeEDLP === "no") {
        edlpRemover();
      }

      rbDBqueryResults(calcResRows, queryResArr, srcRsXLS, queryResArr_1stPage) //queryResArr gets populated and cached with
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
            modifiedQueryResArr: modifiedQueryResArr,
          });
        });
    }
  );
}
