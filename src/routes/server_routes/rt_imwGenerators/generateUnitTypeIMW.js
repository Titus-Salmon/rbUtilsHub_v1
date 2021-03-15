const mysql = require('mysql')

const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
})

export async function post(req, res, next) {

  let nhcrtTableName = req.body.nhcrtTableName
  let ediTableName = req.body.ediTableName
  let venCatPrefix = req.body.venCatPrefix

  let srsObjArr = []

  //*********************************************************************************************** */
  //need to rename the column names to correspond to the new column names, and probably don't need to reassign
  //each column name as AS ..., since we're not removing commas now (because we're enclosing all results in quotes now)
  let query = `
  SELECT DISTINCT nhcrt.inv_ScanCode, nhcrt.ord_supplierstocknumber, nhcrt.inv_name, nhcrt.inv_receiptalias,
  nhcrt.ven_companyname, nhcrt.pi1_Description, nhcrt.pi2_Description,
  edi_table.${venCatPrefix}_upc, edi_table.${venCatPrefix}_unit_type FROM ${nhcrtTableName}
  nhcrt JOIN ${ediTableName} edi_table ON nhcrt.inv_ScanCode
  WHERE nhcrt.inv_ScanCode = edi_table.${venCatPrefix}_upc
  ORDER BY nhcrt.pi1_Description, nhcrt.pi2_Description;`

  function showSearchRes(rows) {

    console.log(`rows[0]==> ${rows[0]}`)
    console.log(`Object.keys(rows[0])==> ${Object.keys(rows[0])}`)

    for (let i = 0; i < rows.length; i++) {

      let srsObj = {}

      let oupNameVar = rows[i]['edi_tableEDIprefixUnitType'] //define variable for oupName
      oupNameSplit = oupNameVar.split(/([0-9]+)/) //should split oupName into array with the digit as the 2nd array element

      srsObj['_#_'] = `${i + 1}`
      srsObj['item_id'] = `${rows[i]['inv_ScanCode']}`
      srsObj['dept_id'] = ''
      srsObj['dept_name'] = ''
      // //v//replace any commas in receipt alias, so columns in IMW don't get shifted
      // let nhcrtInvReceiptAlias = rows[i]['nhcrtInvReceiptAlias']
      // let saniReceiptAlias = nhcrtInvReceiptAlias.replace(",", "")
      // srsObj['recpt_alias'] = saniReceiptAlias
      // //^//replace any commas in receipt alias, so columns in IMW don't get shifted
      srsObj['recpt_alias'] = `${rows[i]['inv_receiptalias']}` // here we use the receipt alias from Catapult, NOT the item name from EDI catalog
      srsObj['brand'] = ''
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
      srsObj['supp_unit_id'] = `${rows[i]['ord_supplierstocknumber']}` //here we use SKU from Catapult (ord_supplierstocknumber), NOT from EDI table (ediSKU)
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
          srsObj['num_pkgs'] = ''
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
          srsObj['case_pk_mult'] = ''
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
            srsObj['case_pk_mult'] = ''
          } else {
            srsObj['case_pk_mult'] = 'badVal'
          }
        }
      }

      srsObj['ovr'] = '1'

      if (rows[i]['ord_supplierstocknumber'] !== '') { //don't include results with empty SKUs
        srsObjArr.push(srsObj)
      }
    }
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