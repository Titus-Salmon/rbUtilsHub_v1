const mysql = require("mysql");
const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
});

import {
  totalPages,
  paginCalcs,
} from "../../../libT0d/commonMethods/paginCalcs";

import queryResArrCache from "../../../nodeCacheStuff/cache1";

//had to revert back to leaving the code for rbDBqueryResults within this file, because for some reason, when importing it from
//an external js file, some tables wouldn't display at all, due to getting a $tableData[0] being undefined error. It only happened
//for some of the gpet tables, and I have no idea why... It was definitely
//only something horking on the frontend, all the backend functionality was working just fine.
//SO FOR NOW, DON'T ATTEMPT FARMING THE rbDBqueryResults() LOGIC OUT TO AN EXTERNAL FUNCTION -- NOT WORTH THE HASSLE
import { rbDBqueryResults } from "../../../libT0d/MySQL/rbDBqueryResults";

export async function post(req, res, next) {
  console.log(`hello from within the async function of RBDBQuery.js`);

  res.setHeader("Content-Type", "application/json");
  console.log(`req.body.data==> ${req.body.data}`);
  let RBDbQuery = req.body.data;

  let queryResArr = []; //array that holds all query results Objs
  let queryResArr_1stPage = []; //array that holds 1st page of query results Objs
  var srcRsXLS = []; //array that holds all query results Objs for generating excel files. Do we need a separate array for this?
  //maybe not, but keeping it this way, in case we need it to be separate from queryResArr in the future. Just cleaner to handle
  //it this way.

  async function rbDBqueryResults(result) {
    let queriedColumns = Object.keys(result[0]);
    console.log(`queriedColumns==> ${queriedColumns}`);

    for (let i = 0; i < result.length; i++) {
      //we are abstracting query result handling here, in order to be able to provide
      //front-end results for any columns that are queried, not just a fixed set of columns
      let rowData = result[i]; //data from row #i
      let rbDBresObj = {};
      // rbDBresObj['ri_70d'] = i + 1
      for (let j = 0; j < queriedColumns.length; j++) {
        let colName = queriedColumns[j];

        rbDBresObj[`${colName}`] = rowData[`${colName}`];
      }
      queryResArr.push(rbDBresObj);
      srcRsXLS.push(rbDBresObj);
    }

    if (queryResArr.length > 100) {
      //if there are more than 100 query results, only push the 1st 100 into the 1st page
      //result set (queryResArr_1stPage)
      for (let i = 0; i < 100; i++) {
        queryResArr_1stPage.push(queryResArr[i]);
      }
    } else {
      queryResArr_1stPage = queryResArr; //if there are 100 or less total query results, the 1st page results are set equal
      //to the whole query result dataset (queryResArr)
    }

    //V// CACHE V_INVENTORYMASTER QUERY RESULTS IN BACKEND (for saveToCSV, and possibly other things)//////////////////////////////////////////////////////////////////////////////
    queryResArrCache.set("queryResArrCache_key", queryResArr);
    console.log(
      `queryResArrCache['data']['queryResArrCache_key']['v'].length==> ${queryResArrCache["data"]["queryResArrCache_key"]["v"].length}`
    );
    console.log(
      `queryResArrCache['data']['queryResArrCache_key']['v'][0]==> ${queryResArrCache["data"]["queryResArrCache_key"]["v"][0]}`
    );
    console.log(
      `JSON.stringify(queryResArrCache['data']['queryResArrCache_key']['v'][0])==> ${JSON.stringify(
        queryResArrCache["data"]["queryResArrCache_key"]["v"][0]
      )}`
    );
    //^// CACHE V_INVENTORYMASTER QUERY RESULTS IN BACKEND //////////////////////////////////////////////////////////////////////////////
  }

  connection.query(RBDbQuery, function (err, rows, fields) {
    // if (err) throw err
    if (err) {
      console.error(err);
      res.json({
        error: `err from RBDBQuery.js==> ${err}`,
      });
    }
    console.log(`rows.length==>${rows.length}`);
    console.log("rows[0]==>", rows[0]);
    rbDBqueryResults(rows)
      .then(paginCalcs(queryResArr))
      .then(() => {
        res.json({
          queryResArr: queryResArr, //this is the entire result set (which we actually may not need to be passing to the front)
          queryResArr_1stPage: queryResArr_1stPage, //this is the 1st page of results, showing the 1st 100 rows
          // "queryResArr_pagin": queryResArr_pagin, //this is whatever page of results we're cal;ing, based on pagination
          totalPages: totalPages,
          currentPage: 1, //set  currentPage to 1 for initial query response, since we'll be on the 1st page
          // nextPage: 1,
          // prevPage: null
        });
      });
  });
}
