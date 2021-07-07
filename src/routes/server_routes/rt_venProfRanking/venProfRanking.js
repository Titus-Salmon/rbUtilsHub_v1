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
        // resObj['ri_70d'] = i + 1
        for (let j = 0; j < queriedColumns.length; j++) {
          let colName = queriedColumns[j];
  
          resObj[`${colName}`] = rowData[`${colName}`];
        }
        nhcrtOptItemSalesArr.push(resObj);
        venCompanynameArr.push(rows[i]['venCompanyname']) //push all non-distinct vendor names to array 
        //(each item's vendor for all nhcrt items)
        // srcRsXLS.push(resObj);
      }

      // for (let i = 0; i < rows.length; i++) {
      //   let nhcrtOptItemSalesObj = {}
      //   nhcrtOptItemSalesObj['ri_t0d'] = i + 1
      //   nhcrtOptItemSalesObj['invScanCode'] = rows[i]['invScanCode']
      //   nhcrtOptItemSalesObj['ordSupplierStockNumber'] = rows[i]['ordSupplierStockNumber']
      //   nhcrtOptItemSalesObj['invSize'] = rows[i]['invSize']
      //   nhcrtOptItemSalesObj['invReceiptAlias'] = rows[i]['invReceiptAlias']
      //   nhcrtOptItemSalesObj['invDateCreated'] = rows[i]['invDateCreated']
      //   nhcrtOptItemSalesObj['ordQuantityInOrderUnit'] = rows[i]['ordQuantityInOrderUnit']
      //   nhcrtOptItemSalesObj['oupName'] = rows[i]['oupName']
      //   nhcrtOptItemSalesObj['stoNumber'] = rows[i]['stoNumber']
      //   nhcrtOptItemSalesObj['brdName'] = rows[i]['brdName']
      //   nhcrtOptItemSalesObj['dptName'] = rows[i]['dptName']
      //   nhcrtOptItemSalesObj['dptNumber'] = rows[i]['dptNumber']
      //   nhcrtOptItemSalesObj['sibIdealMargin'] = rows[i]['sibIdealMargin']
      //   nhcrtOptItemSalesObj['actualMargT0d'] = rows[i]['actualMargT0d']
      //   nhcrtOptItemSalesObj['venCompanyname'] = rows[i]['venCompanyname']
      //   nhcrtOptItemSalesObj['invLastreceived'] = rows[i]['invLastreceived']
      //   nhcrtOptItemSalesObj['invLastsold'] = rows[i]['invLastsold']
      //   nhcrtOptItemSalesObj['invLastcost'] = rows[i]['invLastcost']

      //   nhcrtOptItemSalesObj['sibBasePrice'] = rows[i]['sibBasePrice']

      //   nhcrtOptItemSalesObj['invOnhand'] = rows[i]['invOnhand']
      //   nhcrtOptItemSalesObj['invOnorder'] = rows[i]['invOnorder']
      //   nhcrtOptItemSalesObj['invIntransit'] = rows[i]['invIntransit']
      //   nhcrtOptItemSalesObj['pi1Description'] = rows[i]['pi1Description']
      //   nhcrtOptItemSalesObj['pi2Description'] = rows[i]['pi2Description']

      //   nhcrtOptItemSalesObj['Quantity'] = rows[i]['Quantity']
      //   nhcrtOptItemSalesObj['ExtCost'] = rows[i]['ExtCost']
      //   nhcrtOptItemSalesObj['Sales'] = rows[i]['Sales']

      //   nhcrtOptItemSalesObj['Margin'] = rows[i]['Margin']
      //   nhcrtOptItemSalesObj['percMargin'] = rows[i]['percMargin']

      //   nhcrtOptItemSalesArr.push(nhcrtOptItemSalesObj)
      //   venCompanynameArr.push(rows[i]['venCompanyname']) //push all non-distinct vendor names to array 
      //   //(each item's vendor for all nhcrt items)
      // }
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