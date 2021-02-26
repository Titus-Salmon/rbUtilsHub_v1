const mysql = require('mysql')
const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true,
  debug: true
})

import defaultMargArr from '../../../libT0d/defaultMargs/defaultMargs';
console.log(`defaultMargArr[0]==> ${defaultMargArr[0]}`)
console.log(`JSON.stringify(defaultMargArr[0])==> ${JSON.stringify(defaultMargArr[0])}`)

export async function post(req, res, next) {

  let loadErrors = []

  let tableNameToLoad = req.body.tableName
  console.log(`req.body.tableName==> ${req.body.tableName}`)

  //here we are doing some regex & js "split" magic to extract the "catalog" name from the nej table name we're loading (nejTableNameYYYMMDD):
  let regex1 = /(\d+)/g
  let vendorNameSplit1 = tableNameToLoad.split('nej')
  let vendorNameSplit2 = vendorNameSplit1[1]
  let vendorNameSplit3 = vendorNameSplit2.split(regex1)
  let vendorName = vendorNameSplit3[0]
  let ediVendorName = `EDI-${vendorName.toUpperCase()}`
  console.log(`ediVendorName==> ${ediVendorName}`)

  connection.query(`
  SHOW COLUMNS FROM ${tableNameToLoad};
  SELECT * FROM rainbowcat WHERE ediName = '${ediVendorName}';
  `, (error, rows, fields) => {
    if (error) {
      console.log('error=====>>', error)
      loadErrors.push(error.code)
      console.log('loadErrors==>', loadErrors)
      res.json({
        "error response from loadStagingData.js": loadErrors
      })
    } else {
      let loadedTableRows = rows[0]
      let rainbowCatRows = rows[1]
      console.log(`JSON.stringify(loadedTableRows)==> ${JSON.stringify(loadedTableRows)}`)
      console.log(`JSON.stringify(rainbowCatRows[0])==> ${JSON.stringify(rainbowCatRows[0])}`)
      let discoToApplyCarryOver_WS = rainbowCatRows[0]['ongDscWS']
      let discoToApplyCarryOver_Rtl = rainbowCatRows[0]['ongDscRtl']
      let marginProfile = rainbowCatRows[0]['wellnessMargins']
      let eaNumDivide = rainbowCatRows[0]['EA_Num_divide']
      let csNumDivide = rainbowCatRows[0]['CS_Num_divide']

      res.json({
        tableNameToLoad: tableNameToLoad,
        tableLoadError: loadErrors,
        ongDisco_WS: discoToApplyCarryOver_WS / 100,
        ongDisco_Rtl: discoToApplyCarryOver_Rtl / 100,
        marginProfile: JSON.parse(`${marginProfile}`),
        eaNumDivide: eaNumDivide,
        csNumDivide: csNumDivide,
        beerAlcMarg: beerAlcMarg
      })
    }
  })
}