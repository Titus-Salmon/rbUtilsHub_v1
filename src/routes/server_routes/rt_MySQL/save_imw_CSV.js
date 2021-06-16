const fs = require("fs");

const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true, //MUST HAVE to make more than 1 sql statement in a single query
});

console.log(`hello from top level of save_imw_CSV`);
import save_imw_CSV_cache from "../../../nodeCacheStuff/cache1";
let save_imw_CSV_cacheValue;

export async function post(req, res, next) {
  console.log(`hello from within the async function of save_imw_CSV.js`);

  let fileName = req.body.data;
  let tableType = req.body.tableType;

  var today = new Date();
  var todayIso = today.toISOString();
  var todayIsoSplitArr = todayIso.split("T");
  var todayIsoSplit = todayIsoSplitArr[0];
  var imwTypeColumn;
  var itemsUpdtdTypeColumn;
  var vendorNameSplit3;
  var updateTypeTotal;

  save_imw_CSV_cacheValue = save_imw_CSV_cache.get("save_imw_CSV_cache_key"); // use 'get' to leave key in memory
  console.log(
    `JSON.stringify(save_imw_CSV_cacheValue[0])==> ${JSON.stringify(
      save_imw_CSV_cacheValue[0]
    )}`
  );
  console.log(
    `JSON.stringify(save_imw_CSV_cacheValue[1])==> ${JSON.stringify(
      save_imw_CSV_cacheValue[1]
    )}`
  );
  let firstRowOf_imw_Obj = save_imw_CSV_cacheValue[0];

  //begin csv generator //////////////////////////////////////////////////////////////////////////
  const { Parser } = require("json2csv");

  const fields = Object.keys(firstRowOf_imw_Obj);
  console.log(`fields==> ${fields}`);

  const opts = {
    fields,
  };

  try {
    const parser = new Parser(opts);
    const csv = parser.parse(save_imw_CSV_cacheValue);
    console.log(`req.body from save_imw_CSV==>${req.body}`);
    console.log(
      `JSON.stringify(req.body) from save_imw_CSV==>${JSON.stringify(req.body)}`
    );
    console.log(`csv.length from save_imw_CSV==>> ${csv.length}`);
    fs.writeFile(
      `${process.cwd()}/static/csv/${req.body.data}.csv`,
      csv,
      function (err) {
        if (err) throw err;
        console.log(
          `===>> ${process.cwd()}/static/csv/${req.body.data}.csv saved<<===`
        );
      }
    );
    updateRbCat();
    // res.json({
    //   "response from save_imw_CSV": `~~~~~>> ${process.cwd()}/static/csv/${req.body.data}.csv saved <<~~~~~`
    // })
  } catch (err) {
    console.error(err);
  }
  //end csv generator //////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //v//Automatically add note to rainbowcat table that Retail IMW has been generated//////////////////////////////////////

  function updateRbCat() {
    //here we are doing some js magic to extract the "shortName" from the Rtl IMW name we're saving (nejTableNameRtlIMWYYYMMDD):
    let vendorNameSplit1 = fileName.split("nej");
    let vendorNameSplit2 = vendorNameSplit1[1];
    if (fileName.toLowerCase().includes("rtlimw")) {
      imwTypeColumn = "rtlImw";
      itemsUpdtdTypeColumn = "items_updtd_rtl";
      vendorNameSplit3 = vendorNameSplit2.toLowerCase().split("rtlimw");
      updateTypeTotal = "tot_updtd_rtl";
      console.log(`imwTypeColumn==> ${imwTypeColumn}`);
    }
    if (fileName.toLowerCase().includes("wsimw")) {
      imwTypeColumn = "wsImw";
      itemsUpdtdTypeColumn = "items_updtd_ws";
      vendorNameSplit3 = vendorNameSplit2.toLowerCase().split("wsimw");
      updateTypeTotal = "tot_updtd_ws";
      console.log(`imwTypeColumn==> ${imwTypeColumn}`);
    }
    let vendorName = vendorNameSplit3[0];

    if (tableType.toLowerCase() === "edi") {
      vendorName = `EDI-${vendorName.toUpperCase()}`;
      console.log(`vendorName==> ${vendorName}`);
    }

    if (imwTypeColumn !== undefined) {
      connection.query(
        `UPDATE rainbowcat SET ${imwTypeColumn} = '${req.body.data}.csv (${
          save_imw_CSV_cacheValue.length
        } items)' WHERE shortName = '${vendorName}';
  
          INSERT INTO rainbowcat_update_tracker (date, vendor_name, ${imwTypeColumn}, ${itemsUpdtdTypeColumn})
          VALUES('${todayIsoSplit}', '${vendorName.toUpperCase()}', '${
          req.body.data
        }.csv', '${save_imw_CSV_cacheValue.length}')
          ON DUPLICATE KEY UPDATE ${imwTypeColumn} = ${imwTypeColumn};
  
          UPDATE rainbowcat rbc
          INNER JOIN (
            SELECT vendor_name,
            SUM(${itemsUpdtdTypeColumn}) as total_updated
            FROM rainbowcat_update_tracker
            GROUP BY vendor_name
          )
          rbcut ON rbc.shortName = rbcut.vendor_name
          SET rbc.${updateTypeTotal} = rbcut.total_updated;`,

        function (err, rows, fields) {
          if (err) throw err;
          res.json({
            "response from save_imw_CSV": `+++>> ${process.cwd()}/static/csv/${
              req.body.data
            }.csv saved AND rainbowcat/rainbowcat_update_tracker updated<<+++`,
          });
        }
      );
    } else {
      res.json({
        "response from save_imw_CSV": `**>> ${process.cwd()}/static/csv/${
          req.body.data
        }.csv saved <<**`,
      });
    }
  }

  // updateRbCat()
  //v//Automatically add note to rainbowcat table that Retail IMW has been generated//////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}
