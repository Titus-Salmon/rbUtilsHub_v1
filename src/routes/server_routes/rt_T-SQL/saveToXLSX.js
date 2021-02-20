const xl = require('excel4node')
import catapultResArrCache from "../../../nodeCacheStuff/cache1"
let catapultResArrCacheValue

export async function post(req, res, next) {

  let fileName = req.body.data

  catapultResArrCacheValue = catapultResArrCache.take('catapultResArrCache_key') // this also deletes the key
  console.log(`JSON.stringify(catapultResArrCacheValue[0])==> ${JSON.stringify(catapultResArrCacheValue[0])}`)
  console.log(`Object.keys(catapultResArrCacheValue[0])==> ${Object.keys(catapultResArrCacheValue[0])}`)

  ///̶/̶N̶O̶T̶E̶+̶+̶+̶+̶+̶+̶+̶+̶>̶>̶>̶ s̶r̶c̶R̶s̶X̶L̶S̶_̶t̶s̶q̶l̶ i̶s̶ t̶h̶e̶ o̶r̶i̶g̶i̶n̶a̶l̶ a̶r̶r̶a̶y̶ t̶h̶a̶t̶ h̶o̶l̶d̶s̶ t̶h̶e̶ c̶o̶l̶l̶e̶c̶t̶i̶o̶n̶ o̶f̶ S̶e̶a̶r̶c̶h̶R̶e̶s̶u̶l̶t̶s̶ o̶b̶j̶e̶c̶t̶s̶ {̶c̶o̶l̶u̶m̶n̶N̶a̶m̶e̶:̶ c̶e̶l̶l̶V̶a̶l̶u̶e̶}̶
  ///̶/̶H̶O̶W̶E̶V̶E̶R̶,̶ s̶i̶n̶c̶e̶ t̶h̶e̶ i̶n̶h̶e̶r̶e̶n̶t̶ o̶r̶d̶e̶r̶ (̶f̶r̶o̶m̶ s̶h̶o̶w̶S̶e̶a̶r̶c̶h̶R̶e̶s̶u̶l̶t̶s̶(̶)̶)̶ o̶f̶ t̶h̶e̶s̶e̶ k̶e̶y̶:̶v̶a̶l̶u̶e̶ p̶a̶i̶r̶s̶ i̶s̶ n̶o̶t̶ t̶h̶e̶ o̶r̶d̶e̶r̶ w̶e̶ w̶a̶n̶t̶ t̶o̶ d̶i̶s̶p̶l̶a̶y̶ t̶h̶e̶m̶
  ///̶/̶i̶n̶ t̶h̶e̶ e̶x̶c̶e̶l̶ f̶i̶l̶e̶,̶ a̶n̶d̶ a̶l̶s̶o̶ s̶i̶n̶c̶e̶ t̶h̶e̶r̶e̶ a̶r̶e̶ a̶d̶d̶i̶t̶i̶o̶n̶a̶l̶ k̶e̶y̶:̶v̶a̶l̶u̶e̶ p̶a̶i̶r̶s̶ f̶r̶o̶m̶ s̶r̶c̶R̶s̶X̶L̶S̶_̶t̶s̶q̶l̶ t̶h̶a̶t̶ w̶e̶ D̶O̶N̶'̶T̶ w̶a̶n̶t̶ t̶o̶ d̶i̶s̶p̶l̶a̶y̶ (̶i̶.̶e̶.̶
  ///̶/̶i̶n̶v̶P̶K̶,̶ i̶n̶v̶C̶P̶K̶)̶,̶ w̶e̶ s̶e̶l̶e̶c̶t̶i̶v̶e̶l̶y̶ r̶e̶o̶r̶d̶e̶r̶ a̶n̶d̶/̶o̶r̶ r̶e̶m̶o̶v̶e̶ t̶h̶e̶ k̶e̶y̶:̶v̶a̶l̶u̶e̶ p̶a̶i̶r̶s̶ f̶r̶o̶m̶ s̶r̶c̶R̶s̶X̶L̶S̶_̶t̶s̶q̶l̶ t̶o̶ f̶o̶r̶m̶ t̶h̶e̶ s̶r̶c̶R̶s̶X̶L̶S̶_̶s̶e̶l̶e̶c̶t̶i̶v̶e̶R̶e̶o̶r̶d̶e̶r̶i̶n̶g̶ a̶r̶r̶a̶y̶
  ///̶/̶(̶W̶I̶T̶H̶O̶U̶T̶ m̶o̶d̶i̶f̶y̶i̶n̶g̶ t̶h̶e̶ o̶r̶i̶g̶i̶n̶a̶l̶ s̶r̶c̶R̶s̶X̶L̶S̶_̶t̶s̶q̶l̶ a̶r̶r̶a̶y̶)̶.̶

  // var srcRsXLS_selectiveReordering = []
  var srcRsXLS_abstracted = []

  //Need to provide abstraction to allow for any query's column combination/selection////////////////////////////////////
  let columnNames = Object.keys(catapultResArrCacheValue[0])
  console.log(`typeof columnNames==> ${typeof columnNames}`)
  console.log(`columnNames==> ${columnNames}`)

  for (let a = 0; a < catapultResArrCacheValue.length; a++) {
    let resObj = {}
    for (let b = 0; b < columnNames.length; b++) {
      resObj[`${columnNames[b]}`] = catapultResArrCacheValue[a][`${columnNames[b]}`]
    }
    srcRsXLS_abstracted.push(resObj)
  }

  // for (let a = 0; a < catapultResArrCacheValue.length; a++) {
  //   let reorderedResObj = {}
  //   // THE ORDER OF THE FOLLOWING OBJECT KEYS IS CRITICAL TO THE ORDER OF EXCEL COLUMNS
  //   reorderedResObj['invScanCode'] = catapultResArrCacheValue[a]['invScanCode']
  //   reorderedResObj['ordSuppStockNum'] = catapultResArrCacheValue[a]['ordSuppStockNum']
  //   reorderedResObj['invName'] = catapultResArrCacheValue[a]['invName']
  //   reorderedResObj['invSize'] = catapultResArrCacheValue[a]['invSize']
  //   reorderedResObj['invReceiptAlias'] = catapultResArrCacheValue[a]['invReceiptAlias']
  //   reorderedResObj['invDefault'] = catapultResArrCacheValue[a]['invDefault']
  //   reorderedResObj['posTimeStamp'] = catapultResArrCacheValue[a]['posTimeStamp']
  //   reorderedResObj['invDateCreated'] = catapultResArrCacheValue[a]['invDateCreated']
  //   reorderedResObj['invEmpFkCreatedBy'] = catapultResArrCacheValue[a]['invEmpFkCreatedBy']
  //   reorderedResObj['oupName'] = catapultResArrCacheValue[a]['oupName']
  //   reorderedResObj['stoNumber'] = catapultResArrCacheValue[a]['stoNumber']
  //   // reorderedResObj['stoName'] = catapultResArrCacheValue[a]['stoName']
  //   reorderedResObj['brdName'] = catapultResArrCacheValue[a]['brdName']
  //   reorderedResObj['dptName'] = catapultResArrCacheValue[a]['dptName']
  //   reorderedResObj['dptNumber'] = catapultResArrCacheValue[a]['dptNumber']
  //   reorderedResObj['sibIdealMargin'] = catapultResArrCacheValue[a]['sibIdealMargin']
  //   reorderedResObj['actualMargT0d'] = catapultResArrCacheValue[a]['actualMargT0d']
  //   reorderedResObj['venCompanyname'] = catapultResArrCacheValue[a]['venCompanyname']
  //   reorderedResObj['invLastreceived'] = catapultResArrCacheValue[a]['invLastreceived']
  //   reorderedResObj['invLastsold'] = catapultResArrCacheValue[a]['invLastsold']
  //   reorderedResObj['invLastcost'] = catapultResArrCacheValue[a]['invLastcost']
  //   reorderedResObj['sibBasePrice'] = catapultResArrCacheValue[a]['sibBasePrice']
  //   reorderedResObj['invOnhand'] = catapultResArrCacheValue[a]['invOnhand']
  //   reorderedResObj['invOnorder'] = catapultResArrCacheValue[a]['invOnorder']
  //   reorderedResObj['invIntransit'] = catapultResArrCacheValue[a]['invIntransit']
  //   reorderedResObj['invMemo'] = catapultResArrCacheValue[a]['invMemo']
  //   reorderedResObj['pi1Description'] = catapultResArrCacheValue[a]['pi1Description']
  //   reorderedResObj['pi2Description'] = catapultResArrCacheValue[a]['pi2Description']
  //   reorderedResObj['pi3Description'] = catapultResArrCacheValue[a]['pi3Description']
  //   reorderedResObj['pi4Description'] = catapultResArrCacheValue[a]['pi4Description']
  //   reorderedResObj['invPowerField1'] = catapultResArrCacheValue[a]['invPowerField1']
  //   reorderedResObj['invPowerField2'] = catapultResArrCacheValue[a]['invPowerField2']
  //   reorderedResObj['invPowerField3'] = catapultResArrCacheValue[a]['invPowerField3']
  //   reorderedResObj['invPowerField4'] = catapultResArrCacheValue[a]['invPowerField4']

  //   srcRsXLS_selectiveReordering.push(reorderedResObj)
  // }

  // console.log(`JSON.stringify(srcRsXLS_selectiveReordering[0])==> ${JSON.stringify(srcRsXLS_selectiveReordering[0])}`)

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

  // for (let i = 0; i < Object.keys(srcRsXLS_selectiveReordering[0]).length; i++) {

  //   ws.cell(1, i + 1) //this targets "header" cells
  //     .string(`${Object.keys(srcRsXLS_selectiveReordering[0])[i]}`)
  //     .style(headerStyle)

  //   for (let j = 0; j < srcRsXLS_selectiveReordering.length; j++) {
  //     ws.cell(j + 2, i + 1)
  //       .string(`${Object.values(srcRsXLS_selectiveReordering[j])[i]}`)
  //       .style(bodyStyle)
  //     if (Object.keys(srcRsXLS_selectiveReordering[0])[i] == 'charm') {
  //       ws.cell(j + 2, i + 1).style(charmHilite)
  //     }
  //     if (Object.keys(srcRsXLS_selectiveReordering[0])[i] == 'ediPrice') {
  //       ws.cell(j + 2, i + 1).style(ediPriceHilite)
  //     }
  //     if (Object.keys(srcRsXLS_selectiveReordering[0])[i] == 'sibBasePrice') {
  //       ws.cell(j + 2, i + 1).style(sibBasePriceHilite)
  //     }
  //     if (Object.values(srcRsXLS_selectiveReordering[j])[i] == 'invalid oupName') {
  //       ws.cell(j + 2, i + 1).style(invalidOupName)
  //     }
  //   }
  // }

  console.log(`Object.keys(srcRsXLS_abstracted[0])==> ${Object.keys(srcRsXLS_abstracted[0])}`)
  console.log(`Object.values(srcRsXLS_abstracted[0])==> ${Object.values(srcRsXLS_abstracted[0])}`)
  console.log(`Object.values(srcRsXLS_abstracted)==> ${Object.values(srcRsXLS_abstracted)}`)

  for (let i = 0; i < columnNames.length; i++) {

    ws.cell(1, i + 1) //this targets "header" cells
      .string(`${columnNames[i]}`)
      .style(headerStyle)

    for (let j = 0; j < srcRsXLS_abstracted.length; j++) {
      ws.cell(j + 2, i + 1)
        .string(`${Object.values(srcRsXLS_abstracted[j])[i]}`)
        .style(bodyStyle)
      if (Object.keys(srcRsXLS_abstracted[0])[i] == 'charm') {
        ws.cell(j + 2, i + 1).style(charmHilite)
      }
      if (Object.keys(srcRsXLS_abstracted[0])[i] == 'ediPrice') {
        ws.cell(j + 2, i + 1).style(ediPriceHilite)
      }
      if (Object.keys(srcRsXLS_abstracted[0])[i] == 'sibBasePrice') {
        ws.cell(j + 2, i + 1).style(sibBasePriceHilite)
      }
      if (Object.values(srcRsXLS_abstracted[j])[i] == 'invalid oupName') {
        ws.cell(j + 2, i + 1).style(invalidOupName)
      }
    }
  }

  wb.write(`${process.cwd()}/static/xlsx/${fileName}.xlsx`)

  res.json({
    "response from saveToXLSX": `~~~~~>> ${process.cwd()}/static/xlsx/${fileName}.xlsx saved <<~~~~~`
  })

}