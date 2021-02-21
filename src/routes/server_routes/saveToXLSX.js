const xl = require('excel4node')
import queryResArrCache from "../../nodeCacheStuff/cache1"
let queryResArrCacheValue

export async function post(req, res, next) {

  let fileName = req.body.data

  // queryResArrCacheValue = queryResArrCache.take('queryResArrCache_key') // this also deletes the key
  queryResArrCacheValue = queryResArrCache.get('queryResArrCache_key') // use 'get' to leave key in memory
  console.log(`JSON.stringify(queryResArrCacheValue[0])==> ${JSON.stringify(queryResArrCacheValue[0])}`)
  console.log(`Object.keys(queryResArrCacheValue[0])==> ${Object.keys(queryResArrCacheValue[0])}`)

  var srcRsXLS_abstracted = []

  //Need to provide abstraction to allow for any query's column combination/selection////////////////////////////////////
  let columnNames = Object.keys(queryResArrCacheValue[0])
  console.log(`typeof columnNames==> ${typeof columnNames}`)
  console.log(`columnNames==> ${columnNames}`)

  for (let a = 0; a < queryResArrCacheValue.length; a++) {
    let resObj = {}
    for (let b = 0; b < columnNames.length; b++) {
      resObj[`${columnNames[b]}`] = queryResArrCacheValue[a][`${columnNames[b]}`]
    }
    srcRsXLS_abstracted.push(resObj)
  }

  console.log(`JSON.stringify(srcRsXLS_abstracted[0])==> ${JSON.stringify(srcRsXLS_abstracted[0])}`)


  // Create a new instance of a Workbook class
  var wb = new xl.Workbook()

  // Add Worksheets to the workbook
  var ws = wb.addWorksheet('Sheet 1')

  var bodyStyle = wb.createStyle({
    alignment: {
      wrapText: false,
      horizontal: 'center',
    },
    font: {
      color: 'black',
      size: 12,
    },
    // numberFormat: '$#,##0.00; ($#,##0.00); -',
  })

  var headerStyle = wb.createStyle({
    alignment: {
      wrapText: false,
      horizontal: 'center',
    },
    font: {
      color: 'black',
      size: 14,
      bold: true,

    },
    fill: { // §18.8.20 fill (Fill)
      type: 'pattern', // Currently only 'pattern' is implemented. Non-implemented option is 'gradient'
      patternType: 'solid', //solid=t0d //§18.18.55 ST_PatternType (Pattern Type)
      bgColor: 'black', // HTML style hex value. defaults to black
      fgColor: 'bright green' // HTML style hex value. defaults to black.
    },
  })

  var charmHilite = wb.createStyle({
    fill: { // §18.8.20 fill (Fill)
      type: 'pattern', // Currently only 'pattern' is implemented. Non-implemented option is 'gradient'
      patternType: 'solid', //solid=t0d //§18.18.55 ST_PatternType (Pattern Type)
      bgColor: 'black', // HTML style hex value. defaults to black
      fgColor: '#92D050' // HTML style hex value. defaults to black.
    },
  })

  var ediPriceHilite = wb.createStyle({
    fill: { // §18.8.20 fill (Fill)
      type: 'pattern', // Currently only 'pattern' is implemented. Non-implemented option is 'gradient'
      patternType: 'solid', //solid=t0d //§18.18.55 ST_PatternType (Pattern Type)
      bgColor: 'black', // HTML style hex value. defaults to black
      fgColor: '#93CDDD' // HTML style hex value. defaults to black.
    },
  })

  var sibBasePriceHilite = wb.createStyle({
    fill: { // §18.8.20 fill (Fill)
      type: 'pattern', // Currently only 'pattern' is implemented. Non-implemented option is 'gradient'
      patternType: 'solid', //solid=t0d //§18.18.55 ST_PatternType (Pattern Type)
      bgColor: 'black', // HTML style hex value. defaults to black
      fgColor: 'yellow' // HTML style hex value. defaults to black.
    },
  })

  var invalidOupName = wb.createStyle({
    fill: { // §18.8.20 fill (Fill)
      type: 'pattern', // Currently only 'pattern' is implemented. Non-implemented option is 'gradient'
      patternType: 'solid', //solid=t0d //§18.18.55 ST_PatternType (Pattern Type)
      bgColor: 'black', // HTML style hex value. defaults to black
      fgColor: 'red' // HTML style hex value. defaults to black.
    },
  })

  console.log(`Object.keys(srcRsXLS_abstracted[0])==> ${Object.keys(srcRsXLS_abstracted[0])}`)
  console.log(`Object.values(srcRsXLS_abstracted[0])==> ${Object.values(srcRsXLS_abstracted[0])}`)

  let xlsxCols = Object.keys(srcRsXLS_abstracted[0])

  for (let i = 0; i < columnNames.length; i++) {
    //cell() method takes 2 args: (row, column)
    ws.cell(1, i + 1) //this targets "header" cells
      .string(`${columnNames[i]}`)
      .style(headerStyle)

    for (let j = 0; j < srcRsXLS_abstracted.length; j++) {
      ws.cell(j + 2, i + 1)
        .string(`${Object.values(srcRsXLS_abstracted[j])[i]}`)
        .style(bodyStyle)
      if (xlsxCols[i] === 'charm') {
        ws.cell(j + 2, i + 1).style(charmHilite)
      }
      if (xlsxCols[i] === 'ediPrice') {
        ws.cell(j + 2, i + 1).style(ediPriceHilite)
      }
      if (xlsxCols[i] === 'sib_baseprice') {
        ws.cell(j + 2, i + 1).style(sibBasePriceHilite)
      }
      if (Object.values(srcRsXLS_abstracted[j])[i] === 'invalid oupName') {
        ws.cell(j + 2, i + 1).style(invalidOupName)
      }
    }
  }

  wb.write(`${process.cwd()}/static/xlsx/${fileName}.xlsx`)

  res.json({
    "response from saveToXLSX": `~~~~~>> ${process.cwd()}/static/xlsx/${fileName}.xlsx saved <<~~~~~`
  })

}