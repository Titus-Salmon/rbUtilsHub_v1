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
  lbNumDiv
} from "../../libT0d/calcResults/lbNumDiv"

import {
  nmPk,
  numPkgsCalc
} from "../../libT0d/calcResults/numPkgsCalc"

import {
  csPk,
  ovr,
  csPkMltCalc
} from "../../libT0d/calcResults/csPkMltCalc"

import queryResArrCache from "../../nodeCacheStuff/cache1" //we will use this to overwrite the queryResArrCache initially set from
//within rbDBqueryResults, so that we display only what we want to display for review purposes.

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
    if (parseFloat(catapultCost) !== parseFloat(vendorActlCost)) { //only include results in need of wholesale update
      eaCsNumDiv(i, reqBody, queryResArr, discoMulti_WS)
      lbNumDiv(i, reqBody, queryResArr, discoMulti_WS)
      numPkgsCalc(i, queryResArr) //sets WebOffice Quantity value (the ## in CS-##)
      csPkMltCalc(i, queryResArr) //sets WebOffice Case Pack Multiple value (the ## in EA-##)
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

      //v//handling for choosing to use EDI or Catapult SKU for IMW///////////////////
      if (reqBody.ediOrCatapultSku === 'edi') {
        imwToPop['imwSKU'] = `${queryResArr[i][`${reqBody.venCatPrefix}_sku`]}`
      } else {
        imwToPop['imwSKU'] = `${queryResArr[i]['ord_supplierstocknumber']}`
      }
      //^//handling for choosing to use EDI or Catapult SKU for IMW///////////////////

      imwToPop['imwSKU'] = `${queryResArr[i]['ord_supplierstocknumber']}`
      imwToPop['splrID'] = `${queryResArr[i]['ven_companyname']}`
      imwToPop['unit'] = `${queryResArr[i]['oup_name']}`
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
      // modifiedQueryResArr.push(queryResArr[i])

      ////////////////////////////////////////////////////////////////////////////////////
      // //v//ADD numPkgs, csPkgMltpl, ovr, appliedWSdisco, etc.
      // //v//to modifiedQueryResArr, in order to show for review purposes on frontend
      let reviewObj = {}
      reviewObj['upc'] = `${queryResArr[i]['inv_ScanCode']}`
      reviewObj['cpltSKU'] = `${queryResArr[i]['ord_supplierstocknumber']}`
      reviewObj['ediSKU'] = `${queryResArr[i][`${reqBody.venCatPrefix}_sku`]}`
      if ((reviewObj['cpltSKU']).toLowerCase() !== (reviewObj['ediSKU']).toLowerCase()) { //flag SKU mismatches, if they occur
        reviewObj['skuMismatch'] = `${reviewObj['upc']}`
      } else {
        reviewObj['skuMismatch'] = ""
      }
      reviewObj['deptName'] = `${queryResArr[i]['dpt_name']}`
      reviewObj['rcptAlias'] = `${queryResArr[i]['inv_receiptalias']}`
      reviewObj['brand'] = `${queryResArr[i]['brd_name']}`
      reviewObj['size'] = `${queryResArr[i]['inv_size']}`
      reviewObj['lastCost'] = `${queryResArr[i]['inv_lastcost']}`
      reviewObj['ediCost'] = `${queryResArr[i][`${reqBody.venCatPrefix}_cost`]}`
      reviewObj['WS_disco'] = `${reqBody.ongDisco_WS}`
      reviewObj['ediCostMod'] = `${unitCost}`
      // reviewObj['Rtl_disco'] = `${reqBody.ongDisco_Rtl}`
      reviewObj['sib_baseprice'] = `${queryResArr[i]['sib_baseprice']}`
      // reviewObj['reqdRtl'] = `${reqdRtl}`
      // reviewObj['charm'] = `${charm}`
      reviewObj['ediPrice'] = `${queryResArr[i][`${reqBody.venCatPrefix}_msrp`]}`
      reviewObj['idealMarg'] = `${queryResArr[i]['sib_idealmargin']}`
      reviewObj['actlMarg'] = `${queryResArr[i]['actlMarg']}`
      // reviewObj['appliedMargin'] = `${marginToApply*100}`
      reviewObj['altID'] = `${queryResArr[i]['asc_scancode']}`
      reviewObj['altRcptAlias'] = `${queryResArr[i]['asc_receiptalias']}`
      reviewObj['pkgQnt'] = `${queryResArr[i]['asc_quantity']}` //***this is pkg qty for ALD ID***
      reviewObj['splrID'] = `${queryResArr[i]['ven_companyname']}`
      reviewObj['unit'] = `${queryResArr[i]['oup_name']}`
      reviewObj['numPkgs'] = `${nmPk}`
      reviewObj['csPkgMltpl'] = `${csPk}`
      reviewObj['ovr'] = `${ovr}`
      reviewObj['pf1'] = `${queryResArr[i]['pi1_description']}`
      reviewObj['pf2'] = `${queryResArr[i]['pi2_description']}`
      // reviewObj['pf3'] = ""
      // reviewObj['pf4'] = ""
      // reviewObj['pf5'] = ""
      // reviewObj['pf6'] = ""
      // reviewObj['pf7'] = ""
      // reviewObj['pf8'] = ""

      modifiedQueryResArr.push(reviewObj) //this holds data for displaying REVIEW results
      //AND we are adding come calcResults as well (see above), for review purposes
      //we need some way of reordering our columns for the review array (modifiedQueryResArr), so why not
      //just overwrite your cache with the review results, and everything should fall in place
      //V// CACHE QUERY RESULTS IN BACKEND (for saveToCSV, and possibly other things)//////////////////////////////////////////////////////////////////////////////
      queryResArrCache.set('queryResArrCache_key', modifiedQueryResArr)
      // console.log(`queryResArrCache['data']['queryResArrCache_key']['v'].length==> ${queryResArrCache['data']['queryResArrCache_key']['v'].length}`)
      // console.log(`queryResArrCache['data']['queryResArrCache_key']['v'][0]==> ${queryResArrCache['data']['queryResArrCache_key']['v'][0]}`)
      // console.log(`JSON.stringify(queryResArrCache['data']['queryResArrCache_key']['v'][0])==> ${JSON.stringify(queryResArrCache['data']['queryResArrCache_key']['v'][0])}`)
      //^// CACHE QUERY RESULTS IN BACKEND //////////////////////////////////////////////////////////////////////////////

      // //^//ADD numPkgs, csPkgMltpl, ovr, appliedWSdisco, etc.
      // //^//to modifiedQueryResArr, in order to show for review purposes on frontend

    }
  }
  calcResStatus = `There were ${populated_imw_arr.length} items in need of wholesale update. 
  populated_imw_arr.length = ${populated_imw_arr.length}`
}

export {
  wholesaleCalcs
}