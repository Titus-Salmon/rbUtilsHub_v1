import {
  blank_imw_creator,
} from "../../libT0d/imw/blank_imw_creator"

import {
  discoMulti_WS,
  ongDiscoMulti_WS
} from "../../libT0d/calcResults/ongDiscoMulti_WS"

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

function wholesaleCalcs(reqBody, queryResArr, populated_imw_arr, modifiedQueryResArr, calcResStatus) {
  //populate imw with wholesales from vendor-supplied catalog

  //the following fields need to be populated for WS IMW:
  //Item ID(UPC), Last Cost, Ideal Margin(?), Supplier Unit ID(SKU), Supplier ID(EDI-VENDORNAME), Num Pkgs,
  //Case Pk Mult, Ovr, PF1, PF2, PF5(YYYY-MM-DD WS UPDT(pf5)), PF6(EDI-VENDORNAME)

  //lay out logic for
  //[1] wholesale calcs, taking into account:
  //any ongoing discos
  ongDiscoMulti_WS(reqBody)

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
    let vendorActlCost = vendorRawCost - (vendorRawCost * discoMulti_WS)
    //convert both catapultCost and vendorActlCost to rounded ##.## format
    //(because if one is, say, 21.990 and the other is 21.99, they weill be considered different)
    vendorActlCost = Math.round(vendorActlCost * 100) / 100
    catapultCost = Math.round(catapultCost * 100) / 100
    console.log(`vendorActlCost==> ${vendorActlCost} | catapultCost==> ${catapultCost}`)
    if (catapultCost !== vendorActlCost) { //only include results in need of retail update
      eaCsNumDiv(i, reqBody, queryResArr, discoMulti_WS)
      numPkgsCalc(i, queryResArr)
      csPkMltCalc(i, queryResArr)
      let imwToPop = {}
      blank_imw_creator(imwToPop)
      imwToPop['upc'] = `${queryResArr[i]['inv_ScanCode']}`
      imwToPop['sugstdRtl'] = ""
      imwToPop['lastCost'] = `${unitCost}`
      imwToPop['charm'] = ""
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
      imwToPop['pf5'] = `${new Date().toISOString().split('T', 1)[0]} WS UPDT (pf5)` //Power Field 5 - today's date
      imwToPop['pf6'] = `${queryResArr[i]['ven_companyname']}`
      imwToPop['pf7'] = ""
      imwToPop['pf8'] = ""
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
  calcResStatus = `There were ${populated_imw_arr.length} items in need of wholesale update. 
  populated_imw_arr.length = ${populated_imw_arr.length}`
}

export {
  wholesaleCalcs
}