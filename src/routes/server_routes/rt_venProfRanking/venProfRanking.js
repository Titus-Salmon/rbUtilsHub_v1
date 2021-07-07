import nhcrtOptItemSalesArrCache from "../../../nodeCacheStuff/cache1";

const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true, //MUST HAVE to make more than 1 sql statement in a single query
});

export async function post(req, res, next) {
    let queryText = req.body.queryText
    console.log(`queryText==> ${queryText}`)

    let nhcrtOptItemSalesArr = []
    let venCompanynameArr = [] //holds non-distinct vendor names (for each item in nhcrt)
    let vendorSalesTotArr = []
    let vendorTotalsObjArr = []
    let vendorMarginTotArr = []

    function displayNhcrtOptItemSales(rows) {
      console.log(`hello from top level of displayNhcrtOptItemSales(rows)`)
      let queriedColumns = Object.keys(rows[0]);
      console.log(`queriedColumns==> ${queriedColumns}`);
      for (let i = 0; i < rows.length; i++) {
        //we are abstracting query result handling here, in order to be able to provide
        //front-end results for any columns that are queried, not just a fixed set of columns
        let rowData = rows[i]; //data from row #i
        let resObj = {};
        for (let j = 0; j < queriedColumns.length; j++) {
          let colName = queriedColumns[j];
          resObj[`${colName}`] = rowData[`${colName}`];
        }
        nhcrtOptItemSalesArr.push(resObj);
        venCompanynameArr.push(rows[i]['venCompanyname']) //push all non-distinct vendor names to array 
        //(each item's vendor for all nhcrt items)
        // srcRsXLS.push(resObj);
      }

      nhcrtOptItemSalesArrCache.set('nhcrtOptItemSalesArrCache_key', nhcrtOptItemSalesArr)
      console.log('rows.length~~~>', rows.length)
      console.log(`Object.keys(rows[0])==>${Object.keys(rows[0])}`)

      const distinctVenCompName = [...new Set(venCompanynameArr)] //create "distinct" array of non-repeating vendor names from non-distinct array
      console.log(`distinctVenCompName.length==> ${distinctVenCompName.length}`)
      console.log(`distinctVenCompName==> ${distinctVenCompName}`)

      for (let j = 0; j < distinctVenCompName.length; j++) { //tally sales and margins for each vendor
        var vendorSalesTot = 0
        var vendorMarginTot = 0
        let vendorTotalsObj = {}
        for (let k = 0; k < nhcrtOptItemSalesArr.length; k++) {
          if (distinctVenCompName[j] == nhcrtOptItemSalesArr[k]['venCompanyname']) {
            let vendorSales = nhcrtOptItemSalesArr[k]['Sales']
            let vendorSalesParseInt = parseInt(vendorSales)
            vendorSalesTot += vendorSalesParseInt

            let vendorMargin = nhcrtOptItemSalesArr[k]['Margin']
            let vendorMarginParseInt = parseInt(vendorMargin)
            vendorMarginTot += vendorMarginParseInt
          }
        }
        vendorSalesTotArr.push(vendorSalesTot)
        vendorMarginTotArr.push(vendorMarginTot)
        vendorTotalsObj['vendor'] = distinctVenCompName[j]
        vendorTotalsObj['salesTot'] = vendorSalesTotArr[j]
        vendorTotalsObj['marginTot'] = vendorMarginTotArr[j]
        vendorTotalsObjArr.push(vendorTotalsObj)
      }
      console.log(`vendorSalesTotArr.length==> ${vendorSalesTotArr.length}`)
      console.log(`vendorSalesTotArr==> ${vendorSalesTotArr}`)
      console.log(`JSON.stringify(vendorTotalsObjArr) before sort==> ${JSON.stringify(vendorTotalsObjArr)}`)
      vendorTotalsObjArr.sort(function (a, b) { //sort distinct vendorTotalsObjArr by sales from highest to lowest
        return b.salesTot - a.salesTot
      })
      // vendorTotalsObjArr.forEach((e) => {
      //   console.log(`${e.vendor} ${e.salesTot}`)
      // })
      console.log(`JSON.stringify(vendorTotalsObjArr) AFTER sort==> ${JSON.stringify(vendorTotalsObjArr)}`)
    }

    let mySqlQuery = `${queryText}`

    connection.query(mySqlQuery, function (err, rows, fields) {
      console.log(`hello from top level of connection.query() from within venProfRanking.js`)
      if (err) throw err
      console.log(`rows.length==>${rows.length}`)
      console.log('rows[0]==>', rows[0])
      displayNhcrtOptItemSales(rows)
    }).on("end", function () {
      res.json({
        // nhcrtOptItemSales: nhcrtOptItemSalesArr,
        vendorTotalsObjArr: vendorTotalsObjArr
      })
    })
}