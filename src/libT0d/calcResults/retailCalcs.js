import {
  blank_imw_creator,
} from "../../libT0d/imw/blank_imw_creator"

import {
  discoMulti_Rtl,
  ongDiscoMulti_Rtl
} from "../../libT0d/calcResults/ongDiscoMulti_Rtl"

import {
  unitCost,
  eaCsNumDiv
} from "../../libT0d/calcResults/eaCsNumDiv"

import {
  nmPk,
  numPkgsCalc
} from "../../libT0d/calcResults/numPkgsCalc"

import {
  csPk,
  ovr,
  csPkMltCalc
} from "../../libT0d/calcResults/csPkMltCalc"

// import {
//   defaultMargArr
// } from "../../libT0d/defaultMargs/defaultMargs"

function retailCalcs(reqBody, queryResArr, populated_imw_arr, modifiedQueryResArr, calcResStatus) {

  // //loop through the departments in defaultMargArr, and set a new actlMargArr where the margin values are
  // //taken from req.body.vitSupp, etc...MAY NOT BE NECESSARY, since all of this data should be in the staged data store

  // let actlMargArr = defaultMargArr // 1st we set actlMargArr to defaultMargArr, but we will be modifying 
  // //select parts of actlMargArr below, leaving the rest unchanged.
  // for (let i = 0; i < actlMargArr.length; i++) {
  //   for (let j = 0; j < Object.keys(reqBody).length; j++)
  //     if (actlMargArr[i]['dptName'] === Object.keys(reqBody)[j]) {
  //       actlMargArr[i]['margin'] = Object.values(reqBody)[j]
  //     }
  // }

  // return console.log(`JSON.stringify(actlMargArr)==> ${JSON.stringify(actlMargArr)}`)

  //populate imw with retails from vendor-supplied catalog

  //the following fields need to be populated for Rtl IMW:
  //Item ID(UPC), Sugg Rtl, Ideal Margin(?), Supplier Unit ID(SKU), Supplier ID(EDI-VENDORNAME), Num Pkgs,
  //Case Pk Mult, Ovr, PF1, PF2, PF5(YYYY-MM-DD Rtl UPDT(pf5)), PF6(EDI-VENDORNAME)

  //lay out logic for
  //[1] retail calcs, taking into account:
  //any ongoing discos
  ongDiscoMulti_Rtl(reqBody)

  //[2] ea/cs division to get to unit cost (use Catapult oup_name vals to calc)
  //this is taken care of in eaCsNumDiv() below 

  //[3] Num Pkgs ("Quantity" in WebOffice) - corresponds to CS-##
  //this is taken care of in numPkgsCalc() below 

  //[4] Case Pk Mult ("Case Pack Multiple" in WebOffice) - corresponds to EA-##
  //this is taken care of in csPkMltCalc() below 

  console.log(`queryResArr.length from populateIMW()==> ${queryResArr.length}`)
  for (let i = 0; i < queryResArr.length; i++) {
    let catapultCost = queryResArr[i]['inv_lastcost']
    let vendorRawCost = queryResArr[i][`${reqBody.venCatPrefix}_cost`]
    let vendorActlCost = vendorRawCost - (vendorRawCost * discoMulti_Rtl)
    //convert both catapultCost and vendorActlCost to rounded ##.## format
    //(because if one is, say, 21.990 and the other is 21.99, they weill be considered different)
    vendorActlCost = Math.round(vendorActlCost * 100) / 100
    catapultCost = Math.round(catapultCost * 100) / 100
    console.log(`vendorActlCost==> ${vendorActlCost} | catapultCost==> ${catapultCost}`)
    if (catapultCost !== vendorActlCost) {
      eaCsNumDiv(i, reqBody, queryResArr, discoMulti_Rtl)
      numPkgsCalc(i, queryResArr)
      csPkMltCalc(i, queryResArr)
      let imwToPop = {}
      blank_imw_creator(imwToPop)
      imwToPop['upc'] = `${queryResArr[i]['inv_ScanCode']}`
      let reqdRtl = unitCost / (1 - marginAsDecimal)
      reqdRtl = Math.round(reqdRtl * 100) / 100 //convert reqdRtl to rounded 2-decimal-place number
      imwToPop['sugstdRtl'] = `${charm}` //need -- will be same as charm
      imwToPop['lastCost'] = ""
      imwToPop['charm'] = `${unitCost}/(${1}-${marginAsDecimal})` //need to do the charm calcs & convert to rounded 2-decimal format
      imwToPop['autoDiscount'] = ""
      imwToPop['idealMarg'] = `${queryResArr[i]['sib_idealmargin']}`
      imwToPop['wtPrfl'] = ""
      imwToPop['tax1'] = ""
      imwToPop['tax2'] = ""
      imwToPop['tax3'] = ""
      imwToPop['spclTndr1'] = ""
      imwToPop['spclTndr2'] = ""
      imwToPop['posPrmpt'] = ""
      imwToPop['lctn'] = ""
      imwToPop['altID'] = ""
      imwToPop['altRcptAlias'] = ""
      imwToPop['pkgQnt'] = ""
      imwToPop['imwSKU'] = `${queryResArr[i]['ord_supplierstocknumber']}`
      imwToPop['splrID'] = `${queryResArr[i]['ven_companyname']}`
      imwToPop['unit'] = ""
      imwToPop['numPkgs'] = nmPk
      imwToPop['pf1'] = `${queryResArr[i]['pi1_description']}`
      imwToPop['pf2'] = `${queryResArr[i]['pi2_description']}`
      imwToPop['pf3'] = ""
      imwToPop['pf4'] = ""
      imwToPop['pf5'] = `${new Date().toISOString().split('T', 1)[0]} Rtl UPDT (pf5)` //Power Field 5 - today's date
      imwToPop['pf6'] = `${queryResArr[i]['ven_companyname']}`
      imwToPop['pf7'] = ""
      imwToPop['pf8'] = `actual msrp: ${charm}`
      imwToPop['onhndQnt'] = ""
      imwToPop['rdrPnt'] = ""
      imwToPop['mcl'] = ""
      imwToPop['rdrQnt'] = ""
      imwToPop['memo'] = ""
      imwToPop['flrRsn'] = ""
      imwToPop['dsd'] = ""
      imwToPop['dscMltplr'] = ""
      imwToPop['csPkgMltpl'] = csPk
      imwToPop['ovr'] = ovr

      populated_imw_arr.push(imwToPop)
      modifiedQueryResArr.push(queryResArr[i])
    }
  }
  calcResStatus = `There were ${populated_imw_arr.length} items in need of retail update. 
  populated_imw_arr.length = ${populated_imw_arr.length}`
}

export {
  retailCalcs
}