const mysql = require('mysql')
const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true,
  // debug: true
})

import defaultMargArr from '../../../libT0d/defaultMargs/defaultMargs';
console.log(`defaultMargArr[0]==> ${defaultMargArr[0]}`)
console.log(`JSON.stringify(defaultMargArr[0])==> ${JSON.stringify(defaultMargArr[0])}`)
console.log(`defaultMargArr[0]['dptName']==> ${defaultMargArr[0]['dptName']}`)
console.log(`defaultMargArr[0]['dptNumb']==> ${defaultMargArr[0]['dptNumb']}`)
console.log(`defaultMargArr[0]['margin']==> ${defaultMargArr[0]['margin']}`)

import marginStager from "../../../libT0d/stagingMethods/marginStager"

import charmProfiles from "../../../libT0d/charmProfiles/charmProfiles"

let ongDisco_WS
let ongDisco_Rtl
let marginProfile
let eaNumDivide
let csNumDivide
let stagedMargArr

export async function post(req, res, next) {

  let loadErrors = []
  let stagedMargArr = defaultMargArr //initially set the staged margins array to the same as the default margins array
  //but change the staged margins array as necessary, based on vendor-specific margins by splicing below

  let tableNameToLoad = req.body.tableName
  console.log(`req.body.tableName==> ${req.body.tableName}`)

  let venCatPrefix = req.body.venCatPrefix

  //v//here we are doing some regex & js "split" magic to extract the "catalog" name from the nej table name we're loading (nejTableNameYYYMMDD):
  let regex1 = /(\d+)/g
  let vendorNameSplit1 = tableNameToLoad.split('nej')
  let vendorNameSplit2 = vendorNameSplit1[1]
  let vendorNameSplit3 = vendorNameSplit2.split(regex1)
  let vendorName = vendorNameSplit3[0]
  let ediVendorName = `EDI-${vendorName.toUpperCase()}`
  console.log(`ediVendorName==> ${ediVendorName}`)
  //^//here we are doing some regex & js "split" magic to extract the "catalog" name from the nej table name we're loading (nejTableNameYYYMMDD):

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
      ongDisco_WS = rainbowCatRows[0]['ongDscWS']
      ongDisco_Rtl = rainbowCatRows[0]['ongDscRtl']
      eaNumDivide = rainbowCatRows[0]['EA_Num_divide']
      csNumDivide = rainbowCatRows[0]['CS_Num_divide']
      let vndrWllnssMrgns = rainbowCatRows[0]['wellnessMargins']
      console.log(`vndrWllnssMrgns==> ${vndrWllnssMrgns}`)
      let vndrWllnssMrgns_parsed = JSON.parse(`${vndrWllnssMrgns}`)
      console.log(`Object.keys(vndrWllnssMrgns_parsed)==> ${Object.keys(vndrWllnssMrgns_parsed)}`)
      console.log(`Object.values(vndrWllnssMrgns_parsed)==> ${Object.values(vndrWllnssMrgns_parsed)}`)

      marginStager(defaultMargArr, vndrWllnssMrgns_parsed, stagedMargArr)

      for (let k = 0; k < stagedMargArr.length; k++) {
        console.log(`JSON.stringify(stagedMargArr[k])==> ${JSON.stringify(stagedMargArr[k])}`)
      }
    }
  }).on('end', function () {
    res.json({
      stagedMargins: stagedMargArr,
      charmProfiles: charmProfiles,
      ongDisco_WS: ongDisco_WS,
      ongDisco_Rtl: ongDisco_Rtl,
      eaNumDivide: eaNumDivide,
      csNumDivide: csNumDivide,
      stagedTableName: tableNameToLoad,
      venCatPrefix: venCatPrefix
    })
  })
}