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
console.log(`defaultMargArr[0]['dfltMrg']==> ${defaultMargArr[0]['dfltMrg']}`)

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
      let ongDisco_WS = rainbowCatRows[0]['ongDscWS']
      let ongDisco_Rtl = rainbowCatRows[0]['ongDscRtl']
      let eaNumDivide = rainbowCatRows[0]['EA_Num_divide']
      let csNumDivide = rainbowCatRows[0]['CS_Num_divide']
      let vndrWllnssMrgns = rainbowCatRows[0]['wellnessMargins']
      console.log(`vndrWllnssMrgns==> ${vndrWllnssMrgns}`)
      let vndrWllnssMrgns_parsed = JSON.parse(`${vndrWllnssMrgns}`)
      console.log(`Object.keys(vndrWllnssMrgns_parsed)==> ${Object.keys(vndrWllnssMrgns_parsed)}`)
      console.log(`Object.values(vndrWllnssMrgns_parsed)==> ${Object.values(vndrWllnssMrgns_parsed)}`)

      for (let i = 0; i < defaultMargArr.length; i++) {
        for (let j = 0; j < Object.keys(vndrWllnssMrgns_parsed).length; j++) {
          if (defaultMargArr[i]['dptName'] === Object.keys(vndrWllnssMrgns_parsed)[j]) {
            console.log(`defaultMargArr[i]['dfltMrg']==> ${defaultMargArr[i]['dfltMrg']}`)
            console.log(`Object.keys(vndrWllnssMrgns_parsed)[j]==> ${Object.keys(vndrWllnssMrgns_parsed)[j]}`)
            //need to use wellness margins from rainbowcat, if they differ from the defaults
            //put staged margins in stagedMargArr
            //v//if default wellness margin !== vendor-specific wellness margin
            if (defaultMargArr[i]['dfltMrg'] !== Object.values(vndrWllnssMrgns_parsed)[j]) {
              //use vendor-specific wellness margin
              //replace default value in stagedMargArr with vendor-specific value
              stagedMargArr.splice(i, 1, vndrWllnssMrgns_parsed)[j]
            }
          }
        }
      }
      for (let k = 0; k < stagedMargArr.length; k++) {
        console.log(`JSON.stringify(stagedMargArr[k])==> ${JSON.stringify(stagedMargArr[k])}`)
      }
    }
  }).on('end', function () {
    console.log(`whats going on here`)
    // res.json({
    //   tableNameToLoad: tableNameToLoad,
    //   loadErrors: loadErrors,
    //   ongDisco_WS_dcml: ongDisco_WS / 100,
    //   ongDisco_Rtl_dcml: ongDisco_Rtl / 100,
    //   marginProfile: JSON.parse(`${marginProfile}`),
    //   eaNumDivide: eaNumDivide,
    //   csNumDivide: csNumDivide,
    //   stagedMargArr: stagedMargArr,
    // })
    res.json({
      stagedMargins: stagedMargArr
    })
  })
}