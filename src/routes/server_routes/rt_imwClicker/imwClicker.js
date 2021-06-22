import {
  totalPages,
  paginCalcs,
} from "../../../libT0d/commonMethods/paginCalcs";
import queryResArrCache from "../../../nodeCacheStuff/cache1";

const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true, //MUST HAVE to make more than 1 sql statement in a single query
});

const odbc = require("odbc");
const DSN = process.env.ODBC_CONN_STRING;

export async function post(req, res, next) {
  let queryResArr = []; //array that holds all query results Objs
  let queryResArr_1stPage = []; //array that holds 1st page of query results Objs
  var srcRsXLS = []; //array that holds all query results Objs for generating excel files. Do we need a separate array for this?
  //maybe not, but keeping it this way, in case we need it to be separate from queryResArr in the future. Just cleaner to handle
  //it this way.

  let ediTableName = req.body.ediTableName;
  let venCatPrefix = req.body.venCatPrefix;

  console.log(
    `JSON.stringify(req.body) from generateUnitTypeIMW.js==> ${JSON.stringify(
      req.body
    )}`
  );

  let portalCatUPCarr = [];
  // let portalCatUPCarrToString1 = "";
  let portalCatUPCarrToString2 = "";
  let portCatUPCsInCatapultArr = [];

  //*********************************************************************************************** */
  let portalQuery1 = `
  SELECT * FROM ${ediTableName}
  `;

  // let portalQuery2 = `
  // SELECT * FROM ${ediTableName}
  // WHERE ${venCatPrefix}_upc IN ('${portalCatUPCarrToString2.trim()}')
  // `;

  // let portalQuery2 = `
  // SELECT * FROM ${ediTableName}
  // WHERE ${venCatPrefix}_upc IN ('852244003114')
  // `;

  // let catapultQuery;

  // let catapultQuery = `
  // SELECT inv_ScanCode FROM
  // catapult.ecrs.v_InventoryMaster
  // WHERE trim(inv_ScanCode) IN ('${portalCatUPCarrToString1.trim()}')
  // `;

  // let catapultQuery = `
  // SELECT inv_ScanCode FROM
  // catapult.ecrs.v_InventoryMaster
  // WHERE trim(inv_ScanCode) IN ('852244003114')
  // `;

  async function aggregatePortalCatUPCs() {
    // console.log(`catapultQuery==> ${catapultQuery}`);
    connection
      .query(portalQuery1, function (err, rows, fields) {
        if (err) throw err;
        for (let i = 0; i < rows.length; i++) {
          let portalCatUPC = rows[i][`${venCatPrefix}_upc`];
          portalCatUPCarr.push(`${portalCatUPC}`);
        }
      })
      .on("end", function () {
        let portalCatUPCarrToString1 = portalCatUPCarr
          .map((arrayItem) => `'${arrayItem}'`)
          .join(",");
        let startingindex = 1;
        let endingindex = portalCatUPCarrToString1.length + 1;
        portalCatUPCarrToString1 = portalCatUPCarrToString1.slice(
          startingindex,
          endingindex
        );
        console.log(
          `portalCatUPCarr.length from aggregatePortalCatUPCs==> ${portalCatUPCarr.length}`
        );
        console.log(
          `JSON.stringify(portalCatUPCarr[0]) from aggregatePortalCatUPCs==> ${JSON.stringify(
            portalCatUPCarr[0]
          )}`
        );
        console.log(
          `typeof portalCatUPCarrToString1==> ${typeof portalCatUPCarrToString1}`
        );
        let stringTest1a = portalCatUPCarrToString1.substring(0, 41);
        let stringTest1b = portalCatUPCarrToString1.substring(
          portalCatUPCarrToString1.length - 41,
          portalCatUPCarrToString1.length
        );
        console.log(`stringTest1a==> ${stringTest1a}`);
        console.log(`stringTest1b==> ${stringTest1b}`);
        let catapultQuery = `
  SELECT DISTINCT inv_ScanCode FROM
  catapult.ecrs.v_InventoryMaster
  WHERE trim(inv_ScanCode) IN ('${portalCatUPCarrToString1.trim()})
  `;
        // console.log(`catapultQuery==> ${catapultQuery}`);
        odbcPart(catapultQuery);
        // .then(spliceOutPortalCatUPCsInCatapult())
        // .then(showPortalCatUPCsNotINCatapult());
      });
  }

  async function aggregateCatapultUPCs(result) {
    for (let i = 0; i < result.length; i++) {
      let portCatUPCsInCatapult = result[i]["inv_ScanCode"].trim();
      portCatUPCsInCatapultArr.push(`${portCatUPCsInCatapult}`);
    }
    console.log(
      `portCatUPCsInCatapultArr.length from aggregateCatapultUPCs==> ${portCatUPCsInCatapultArr.length}`
    );
    console.log(
      `JSON.stringify(portCatUPCsInCatapultArr[0]) from aggregateCatapultUPCs==> ${JSON.stringify(
        portCatUPCsInCatapultArr[0]
      )}`
    );
    await spliceOutPortalCatUPCsInCatapult();
  }

  async function odbcPart(catapultQuery) {
    odbc.connect(DSN, (error, connection) => {
      connection.query(catapultQuery, (error, result) => {
        if (error) {
          console.error(error);
          res.json({
            error: `error from imwClicker.js==> ${error}`,
          });
        }
        aggregateCatapultUPCs(result);
      });
      // aggregateCatapultUPCs(result);
    });
    // await aggregateCatapultUPCs(result);
  }

  async function spliceOutPortalCatUPCsInCatapult() {
    console.log(
      `portCatUPCsInCatapultArr.length==> ${portCatUPCsInCatapultArr.length}`
    );
    console.log(`portalCatUPCarr.length==> ${portalCatUPCarr.length}`);
    for (let i = 0; i < portCatUPCsInCatapultArr.length; i++) {
      for (let j = 0; j < portalCatUPCarr.length; j++) {
        if (portCatUPCsInCatapultArr[i].trim() == portalCatUPCarr[j].trim()) {
          //splice out UPCs from portalCatUPCarr that are contained in portCatUPCsInCatapultArr
          portalCatUPCarr.splice(j, 1, "");
        }
      }
    }
    console.log(
      `portalCatUPCarr.length from spliceOutPortalCatUPCsInCatapult==> ${portalCatUPCarr.length}`
    );
    console.log(
      `JSON.stringify(portalCatUPCarr[0]) from spliceOutPortalCatUPCsInCatapult==> ${JSON.stringify(
        portalCatUPCarr[0]
      )}`
    );
    portalCatUPCarrToString2 = portalCatUPCarr
      .map((arrayItem) => `'${arrayItem}'`)
      .join(",");
    let startingindex = 0;
    let endingindex = portalCatUPCarrToString2.length;
    portalCatUPCarrToString2 = portalCatUPCarrToString2.slice(
      startingindex,
      endingindex
    );
    let stringTest2 = portalCatUPCarrToString2.substring(0, 41);
    console.log(`stringTest2==> ${stringTest2}`);
    // showPortalCatUPCsNotINCatapult();
    let portalQuery2 = `
  SELECT * FROM ${ediTableName}
  WHERE ${venCatPrefix}_upc IN (${portalCatUPCarrToString2.trim()})
  `;
    let portalQuery2Test1 = portalQuery2.substring(
      portalQuery2.length - 1 - 41,
      portalQuery2.length - 1
    );
    console.log(`portalQuery2Test1==> ${portalQuery2Test1}`);
    await showPortalCatUPCsNotINCatapult(portalQuery2);
  }

  async function showPortalCatUPCsNotINCatapult(portalQuery2) {
    connection
      .query(portalQuery2, function (err, rows, fields) {
        if (err) throw err;

        let queriedColumns = Object.keys(rows[0]);
        console.log(`queriedColumns==> ${queriedColumns}`);
        for (let i = 0; i < rows.length; i++) {
          let rowData = rows[i]; //data from row #i
          let resObj = {};
          resObj["ri_t0d"] = i + 1;
          for (let j = 0; j < queriedColumns.length; j++) {
            let colName = queriedColumns[j];
            resObj[`${colName}`] = rowData[`${colName}`];
          }
          queryResArr.push(resObj);
          srcRsXLS.push(resObj);
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

        //V// CACHE QUERY RESULTS IN BACKEND (for saveToCSV, and possibly other things)//////////////////////////////////////////////////////////////////////////////
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
        //^// CACHE QUERY RESULTS IN BACKEND //////////////////////////////////////////////////////////////////////////////
      })
      .on("end", function () {
        console.log(
          `queryResArr.length from showPortalCatUPCsNotINCatapult==> ${queryResArr.length}`
        );
        console.log(
          `JSON.stringify(queryResArr[0]) from showPortalCatUPCsNotINCatapult==> ${JSON.stringify(
            queryResArr[0]
          )}`
        );
        paginCalcs(queryResArr).then(() => {
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
        // res.json({
        //   queryResArr: queryResArr, //this is the entire result set (which we actually may not need to be passing to the front)
        //   queryResArr_1stPage: queryResArr_1stPage, //this is the 1st page of results, showing the 1st 100 rows
        //   // "queryResArr_pagin": queryResArr_pagin, //this is whatever page of results we're cal;ing, based on pagination
        //   totalPages: totalPages,
        //   currentPage: 1, //set  currentPage to 1 for initial query response, since we'll be on the 1st page
        // });
      });
  }

  aggregatePortalCatUPCs();

  // aggregatePortalCatUPCs()
  //   // .then(odbcPart())
  //   .then(spliceOutPortalCatUPCsInCatapult())
  //   .then(showPortalCatUPCsNotINCatapult());

  // aggregatePortalCatUPCs()
  //   .then(aggregateCatapultUPCs())
  //   .then(spliceOutPortalCatUPCsInCatapult())
  //   .then(showPortalCatUPCsNotINCatapult());

  // aggregatePortalCatUPCs();
  // // .then(aggregateCatapultUPCs())
  // // .then(spliceOutPortalCatUPCsInCatapult())
  // // .then(showPortalCatUPCsNotINCatapult())
  // // .then(
  // //   res.json({
  // //     queryResArr: queryResArr,
  // //   })
  // // );
}
