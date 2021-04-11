const mysql = require('mysql')

const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
})

import queryResArrCache from "../../../nodeCacheStuff/cache1"

export async function post(req, res, next) {

  let nhcrtTableName = req.body.nhcrtTableName
  let ediTableName = req.body.ediTableName
  let venCatPrefix = req.body.venCatPrefix
  let skuToggle = req.body.skuToggle
  let prchQtyOverride = req.body.prchQtyOverride

  console.log(`JSON.stringify(req.body) from itemNamerIMW.js==> ${JSON.stringify(req.body)}`)

  let srsObjArr = []

  //*********************************************************************************************** */
  //need to rename the column names to correspond to the new column names, and probably don't need to reassign
  //each column name as AS ..., since we're not removing commas now (because we're enclosing all results in quotes now)
  let query = `
  SELECT DISTINCT nhcrt.inv_ScanCode, nhcrt.ord_supplierstocknumber, nhcrt.inv_name, nhcrt.inv_receiptalias,
  nhcrt.ven_companyname, nhcrt.asc_scancode, nhcrt.pi1_Description, nhcrt.pi2_Description,
  edi_table.${venCatPrefix}_upc, edi_table.${venCatPrefix}_sku, edi_table.${venCatPrefix}_unit_type 
  edi_table.${venCatPrefix}_name
  FROM ${nhcrtTableName}
  nhcrt JOIN ${ediTableName} edi_table ON nhcrt.inv_ScanCode
  WHERE nhcrt.inv_ScanCode = edi_table.${venCatPrefix}_upc
  OR nhcrt.asc_scancode = edi_table.${venCatPrefix}_upc
  ORDER BY nhcrt.pi1_Description, nhcrt.pi2_Description;`

  function showSearchRes(rows) {

    console.log(`hello from within showSearchRes, OUTSIDE of rows.length loop`)


    console.log(`rows[0]==> ${rows[0]}`)
    console.log(`JSON.stringify(rows[0])==> ${JSON.stringify(rows[0])}`)

    console.log(`Object.keys(rows[0])==> ${Object.keys(rows[0])}`)

    for (let i = 0; i < rows.length; i++) {

      console.log(`hello from within showSearchRes, INSIDE of rows.length loop`)

      let srsObj = {}

      let oupNameVar = rows[i][venCatPrefix + '_unit_type'] //define variable for oupName
      let oupNameSplit = oupNameVar.split(/([0-9]+)/) //should split oupName into array with the digit as the 2nd array element

      srsObj['_#_'] = `${i + 1}`
      srsObj['item_id'] = `${rows[i]['inv_ScanCode']}`
      srsObj['dept_id'] = ''
      srsObj['dept_name'] = ''
      srsObj['recpt_alias'] = `${rows[i]['inv_receiptalias']}` // here we use the receipt alias from Catapult, NOT the item name from EDI catalog
      srsObj['brand'] = ''
      console.log(`rows[i][venCatPrefix_name]==> ${rows[i][`${venCatPrefix}_name`]}`)
      let vendItemNameVar = rows[i][`${venCatPrefix}_name`]
      let vendItemNameSplit = vendItemNameVar.split(',')
      console.log(`vendItemNameSplit.length==> ${vendItemNameSplit.length}`)
      console.log(`vendItemNameSplit==> ${vendItemNameSplit}`)
      srsObj['item_name'] = ''
      srsObj['size'] = ''
      srsObj['sugg_retail'] = ''
      srsObj['last_cost'] = ''
      srsObj['base_price'] = ''
      srsObj['auto_discount'] = ''
      srsObj['ideal_margin'] = ''
      srsObj['weight_profile'] = ''
      srsObj['tax1'] = ''
      srsObj['tax2'] = ''
      srsObj['tax3'] = ''
      srsObj['spec_tndr1'] = ''
      srsObj['spec_tndr2'] = ''
      srsObj['pos_prompt'] = ''
      srsObj['location'] = ''
      srsObj['alternate_id'] = ''
      srsObj['alt_rcpt_alias'] = ''
      srsObj['pkg_qty'] = ''
      if (skuToggle === "edi") { //toggle for EDI versus Catapult SKU. This seems like the best place to catch any SKU mismatches,
        //since we're dealing with a result set of all items in the new vendor catalog that exist in Catapult, so we catch everything
        //at once here, not just items that need a wholesale or retail update. Plus, this should simplify the code for the
        //wholesaleCalcs and retailCalcs portions of calcResults.
        srsObj['supp_unit_id'] = `${rows[i][`${venCatPrefix}_sku`]}` // here we use the receipt alias from Catapult, NOT the item name from EDI catalog
      } else {
        srsObj['supp_unit_id'] = `${rows[i]['ord_supplierstocknumber']}` // here we use the receipt alias from Catapult, NOT the item name from EDI catalog
      }
      srsObj['supplier_id'] = `${rows[i]['ven_companyname']}`
      srsObj['unit'] = `${rows[i][`${venCatPrefix}_unit_type`]}` // here we use ${venCatPrefix}_unit_type from EDI table, NOT from Catapult (nhcrt.oupName)

      if (oupNameSplit[0].toLowerCase().includes('cs') || oupNameSplit[0].toLowerCase().includes('case')) {
        if (oupNameSplit[1]) {
          srsObj['num_pkgs'] = `${oupNameSplit[1]}`
        } else {
          srsObj['num_pkgs'] = 'badValCS'
        }
      } else {
        if (oupNameSplit[0].toLowerCase().includes('ea') ||
          oupNameSplit[0].toLowerCase().includes('each')) {
          srsObj['num_pkgs'] = '1'
        } else {
          srsObj['num_pkgs'] = 'badVal'
        }
      }

      srsObj['category'] = ''
      srsObj['sub_category'] = ''
      srsObj['product_group'] = ''
      srsObj['product_flag'] = ''
      srsObj['rb_note'] = ''
      srsObj['edi_default'] = ''
      srsObj['powerfield_7'] = ''
      srsObj['temp_group'] = ''
      srsObj['onhand_qty'] = ''
      srsObj['reorder_point'] = ''
      srsObj['mcl'] = ''
      srsObj['reorder_qty'] = ''
      srsObj['memo'] = ''
      srsObj['flrRsn'] = ''
      srsObj['dsd'] = ''
      srsObj['disc_mult'] = ''

      if (oupNameSplit[0].toLowerCase().includes('cs') || oupNameSplit[0].toLowerCase().includes('case')) {
        if (oupNameSplit[1]) {
          srsObj['case_pk_mult'] = '1'
        } else {
          srsObj['case_pk_mult'] = 'badValCS'
        }
      } else {
        if (oupNameSplit[0].toLowerCase().includes('ea') || oupNameSplit[0].toLowerCase().includes('each')) {
          if (oupNameSplit[1]) {
            srsObj['case_pk_mult'] = `${oupNameSplit[1]}`
          } else {
            srsObj['case_pk_mult'] = 'badValEA'
          }
        } else {
          if (oupNameSplit[0].toLowerCase().includes('cs') ||
            oupNameSplit[0].toLowerCase().includes('case')) {
            srsObj['case_pk_mult'] = '1'
          } else {
            srsObj['case_pk_mult'] = 'badVal'
          }
        }
      }

      if (prchQtyOverride === "yes") {
        srsObj['ovr'] = '1'
      } else {
        srsObj['ovr'] = '0'
      }

      if (rows[i]['ord_supplierstocknumber'] !== '') { //don't include results with empty SKUs
        srsObjArr.push(srsObj)
      }
    }

    //V// CACHE V_INVENTORYMASTER QUERY RESULTS IN BACKEND (for saveToCSV, and possibly other things)//////////////////////////////////////////////////////////////////////////////
    queryResArrCache.set('queryResArrCache_key', srsObjArr)
    console.log(`queryResArrCache['data']['queryResArrCache_key']['v'].length==> ${queryResArrCache['data']['queryResArrCache_key']['v'].length}`)
    console.log(`queryResArrCache['data']['queryResArrCache_key']['v'][0]==> ${queryResArrCache['data']['queryResArrCache_key']['v'][0]}`)
    console.log(`JSON.stringify(queryResArrCache['data']['queryResArrCache_key']['v'][0])==> ${JSON.stringify(queryResArrCache['data']['queryResArrCache_key']['v'][0])}`)
    //^// CACHE V_INVENTORYMASTER QUERY RESULTS IN BACKEND //////////////////////////////////////////////////////////////////////////////

  }

  connection.query(query,
    function (err, rows, fields) {
      if (err) throw err
      showSearchRes(rows)
    }).on('end', function () {
    res.json({
      srsObjArr: srsObjArr,
    })
  })
}