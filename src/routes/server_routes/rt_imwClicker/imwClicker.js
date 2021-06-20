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

// import queryResArrCache from "../../../nodeCacheStuff/cache1";

export async function post(req, res, next) {
  let ediTableName = req.body.ediTableName;
  let venCatPrefix = req.body.venCatPrefix;

  console.log(
    `JSON.stringify(req.body) from generateUnitTypeIMW.js==> ${JSON.stringify(
      req.body
    )}`
  );

  let portalCatUPCarr = [];
  let portalCatUPCarrToString1;
  let portalCatUPCarrToString2;
  let portCatUPCsInCatapultArr = [];
  let resObjArr = [];

  //*********************************************************************************************** */
  let portalQuery1 = `
  SELECT * FROM ${ediTableName}
  `;

  let portalQuery2 = `
  SELECT * FROM ${ediTableName} 
  WHERE ${venCatPrefix}_upc IN (${portalCatUPCarrToString2})
  `;

  let catapultQuery = `
  SELECT inv_ScanCode FROM
  catapult.ecrs.v_InventoryMaster
  WHERE trim(inv_ScanCode) IN (${portalCatUPCarrToString1})
  `;

  // let catapultQuery = `
  // SELECT inv_ScanCode FROM
  // catapult.ecrs.v_InventoryMaster
  // WHERE trim(inv_ScanCode) IN ('810003420220')
  // `;

  async function aggregatePortalCatUPCs() {
    connection
      .query(portalQuery1, function (err, rows, fields) {
        if (err) throw err;
        for (let i = 0; i < rows.length; i++) {
          let portalCatUPC = rows[i][`${venCatPrefix}_upc`];
          portalCatUPCarr.push(`${portalCatUPC}`);
        }
        portalCatUPCarrToString1 = portalCatUPCarr
          .map((arrayItem) => `'${arrayItem}'`)
          .join(",");
      })
      .on("end", function () {
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
        aggregateCatapultUPCs();
      });
  }

  async function aggregateCatapultUPCs() {
    odbc.connect(DSN, (error, connection) => {
      connection.query(`${catapultQuery}`, (error, result) => {
        if (error) {
          console.error(error);
          res.json({
            error: `error from imwClicker.js==> ${error}`,
          });
        }
        for (let i = 0; i < result.length; i++) {
          let portCatUPCsInCatapult = result[i]["inv_ScanCode"];
          portCatUPCsInCatapultArr.push(`${portCatUPCsInCatapult}`);
        }

        odbc.close(function () {
          console.log(
            `portCatUPCsInCatapultArr.length from aggregateCatapultUPCs==> ${portCatUPCsInCatapultArr.length}`
          );
          console.log(
            `JSON.stringify(portCatUPCsInCatapultArr[0]) from aggregateCatapultUPCs==> ${JSON.stringify(
              portCatUPCsInCatapultArr[0]
            )}`
          );
          spliceOutPortalCatUPCsInCatapult();
        });
      });
    });
  }

  async function spliceOutPortalCatUPCsInCatapult() {
    for (let i = 0; i < portCatUPCsInCatapultArr.length; i++) {
      for (let j = 0; j < portalCatUPCarr.length; j++) {
        if (portCatUPCsInCatapultArr[i] === portalCatUPCarr[j]) {
          //splice out UPCs from portalCatUPCarr that are contained in portCatUPCsInCatapultArr
          portalCatUPCarr.splice(j);
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
    console.log(`portalCatUPCarrToString2==> ${portalCatUPCarrToString2}`);
    showPortalCatUPCsNotINCatapult();
  }

  async function showPortalCatUPCsNotINCatapult() {
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
          resObjArr.push(resObj);
        }
      })
      .on("end", function () {
        console.log(
          `resObjArr.length from showPortalCatUPCsNotINCatapult==> ${resObjArr.length}`
        );
        console.log(
          `JSON.stringify(resObjArr[0]) from showPortalCatUPCsNotINCatapult==> ${JSON.stringify(
            resObjArr[0]
          )}`
        );
        res.json({
          resObjArr: resObjArr,
        });
      });
  }

  aggregatePortalCatUPCs();
  // .then(aggregateCatapultUPCs())
  // .then(spliceOutPortalCatUPCsInCatapult())
  // .then(showPortalCatUPCsNotINCatapult())
  // .then(
  //   res.json({
  //     resObjArr: resObjArr,
  //   })
  // );
}
