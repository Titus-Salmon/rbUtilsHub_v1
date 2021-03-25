import {
  blank_imw_creator,
} from "../../libT0d/imw/blank_imw_creator"
import {
  discoMulti_Rtl,
  ongDiscoMulti_Rtl
} from "../../libT0d/calcResults/ongDiscoMulti_Rtl"
import {
  unitCost,
  eaCsNumDiv,
  lbNumDiv,
  ozNumDiv,
  ctNumDiv
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
import
dptNameNumbMargMaster
from "../../libT0d/defaultMargs/dptNameNumbMargMaster"

import queryResArrCache from "../../nodeCacheStuff/cache1" //we will use this to overwrite the queryResArrCache initially set from
//within rbDBqueryResults, so that we display only what we want to display for review purposes.

function retailCalcs(reqBody, queryResArr, populated_imw_arr, modifiedQueryResArr, calcResStatus) {

  let charm
  let dptAbbr
  let reqdRtl
  let marginToApply

  //populate imw with retails from vendor-supplied catalog
  let stagedDptMargData = reqBody.stagedDptMargData
  //so stagedDptMargData = [{dptName: vitSupp, dptNumb: '157'; margin: '50'}, ...]

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

  console.log(`stagedDptMargData.length==> ${stagedDptMargData.length}`)

  for (let i = 0; i < queryResArr.length; i++) {

    for (let j = 0; j < stagedDptMargData.length; j++) {
      eaCsNumDiv(i, reqBody, queryResArr, discoMulti_Rtl)
      lbNumDiv(i, reqBody, queryResArr, discoMulti_Rtl)
      ozNumDiv(i, reqBody, queryResArr, discoMulti_Rtl)
      ctNumDiv(i, reqBody, queryResArr, discoMulti_Rtl)
      numPkgsCalc(i, queryResArr) //sets WebOffice Quantity value (the ## in CS-##)
      csPkMltCalc(i, queryResArr) //sets WebOffice Case Pack Multiple value (the ## in EA-##)
      if (queryResArr[i]['dpt_number'] === stagedDptMargData[j]['dptNumb']) {
        marginToApply = stagedDptMargData[j]['margin'] / 100
        reqdRtl = unitCost / (1 - marginToApply)
        reqdRtl = Math.round(reqdRtl * 100) / 100 //convert reqdRtl to rounded 2-decimal-place number

        //retail charm calcs are based on the following logic:
        // if (reqdRetail<lowerCutRqdRtl) {
        //   perform lower cutoff charm calcs
        // } else {
        //   if (reqdRetail<upperCharmRqdRtl) {
        //     perform upper cutoff charm calcs
        //   } else {
        //     use the defaultcharm4 calcs
        //   }
        // }
        //1st, we have to check whether we're dealing with a grocery or wellness item
        //(in order to apply the appropriate charm profile):
        for (let k = 0; k < dptNameNumbMargMaster.length; k++) {
          if (dptNameNumbMargMaster[k]['mainDpt'] === 'grocery') {
            dptAbbr = "Groc"
          }
          if (dptNameNumbMargMaster[k]['mainDpt'] === 'wellness') {
            dptAbbr = "Well"
          }
          if (reqdRtl < reqBody[`lowerCutoffRqdRtl${dptAbbr}`]) { //if req'd rtl is below lower cutoff
            //perform lower cutoff charm calcs
            if (reqdRtl % 1 > .80) {
              charm = reqdRtl - reqdRtl % 1 + parseFloat(reqBody[`lowerCutoffCharm${dptAbbr}7`])
            }
            if (reqdRtl % 1 < .80) {
              charm = reqdRtl - reqdRtl % 1 + parseFloat(reqBody[`lowerCutoffCharm${dptAbbr}6`])
            }
            if (reqdRtl % 1 < .60) {
              charm = reqdRtl - reqdRtl % 1 + parseFloat(reqBody[`lowerCutoffCharm${dptAbbr}5`])
            }
            if (reqdRtl % 1 < .50) {
              charm = reqdRtl - reqdRtl % 1 + parseFloat(reqBody[`lowerCutoffCharm${dptAbbr}4`])
            }
            if (reqdRtl % 1 < .40) {
              charm = reqdRtl - reqdRtl % 1 + parseFloat(reqBody[`lowerCutoffCharm${dptAbbr}3`])
            }
            if (reqdRtl % 1 < .30) {
              charm = reqdRtl - reqdRtl % 1 + parseFloat(reqBody[`lowerCutoffCharm${dptAbbr}2`])
            }
            if (reqdRtl % 1 < .20) {
              charm = reqdRtl - reqdRtl % 1 + parseFloat(reqBody[`lowerCutoffCharm${dptAbbr}1`])
            }
            if (reqdRtl % 1 < .10) { //change charm price to (#-1).99 if req'd rtl is #.00 -> #.10
              charm = reqdRtl - reqdRtl % 1 - .01
            }
          } else {
            if (reqdRtl < reqBody[`upperCutoffRqdRtl${dptAbbr}`]) { //if req'd rtl is below upper charm cutoff
              //($12 for Grocery & $9999 for Wellness)
              if (reqdRtl % 1 > .856) { //bump anything from #.85+ and higher ==> #.99
                charm = reqdRtl - reqdRtl % 1 + parseFloat(reqBody[`defaultCharm${dptAbbr}4`])
              }
              if (reqdRtl % 1 <= .855) { //bump anything from #.56 to #.85 ==> #.79 (Grocery); Wellness gets bumped
                //to #.99 for anything from #.56 to #.85 (because defaultCharm3 for Grocery is .79, but for Wellness it is .99)
                charm = reqdRtl - reqdRtl % 1 + parseFloat(reqBody[`defaultCharm${dptAbbr}3`])
              }
              if (reqdRtl % 1 <= .55) { //bump anything from #.36 to #.55 ==> #.49
                charm = reqdRtl - reqdRtl % 1 + parseFloat(reqBody[`defaultCharm${dptAbbr}2`])
              }
              if (reqdRtl % 1 <= .35) { //bump anything from #.10 to #.35 ==> #.29
                charm = reqdRtl - reqdRtl % 1 + parseFloat(reqBody[`defaultCharm${dptAbbr}1`])
              }
              if (reqdRtl % 1 < .10) { //change charm price to (#-1).99 if req'd rtl is #.00 -> #.10
                charm = reqdRtl - reqdRtl % 1 - .01
              }
            } else { //if req'd rtl is above upper charm cutoff
              //($12 for Grocery & $9999 for Wellness), use defaultCharm4 for charm. Really this only applies to Grocery,
              //since Wellness upper charm cutoff is set so high
              charm = reqdRtl - reqdRtl % 1 + parseFloat(reqBody[`defaultCharm${dptAbbr}`])
            }
          }
        }
      }
    }
    calcResStatus = `There were ${populated_imw_arr.length} items in need of retail update. populated_imw_arr.length = ${populated_imw_arr.length}`

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    let catapultRtl = queryResArr[i]['sib_baseprice']

    if (parseFloat(catapultRtl) !== parseFloat(charm)) { //only include results in need of retail update
      let imwToPop = {}
      blank_imw_creator(imwToPop)
      imwToPop['upc'] = `${queryResArr[i]['inv_ScanCode']}`
      imwToPop['sugstdRtl'] = `${charm}`
      imwToPop['lastCost'] = ""
      imwToPop['charm'] = `${charm}`
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
      console.log(`reqBody from retailCalcs==> ${reqBody}`)
      console.log(`JSON.stringify(reqBody) from retailCalcs==> ${JSON.stringify(reqBody)}`)

      if (reqBody.ediOrCatapultSku === 'edi') {
        imwToPop['imwSKU'] = `${queryResArr[i][`${reqBody.venCatPrefix}_sku`]}`
      } else {
        imwToPop['imwSKU'] = `${queryResArr[i]['ord_supplierstocknumber']}`
      }
      //^//handling for choosing to use EDI or Catapult SKU for IMW///////////////////

      imwToPop['splrID'] = `${queryResArr[i]['ven_companyname']}`
      imwToPop['unit'] = `${queryResArr[i]['oup_name']}`
      imwToPop['numPkgs'] = `${nmPk}`
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
      imwToPop['csPkgMltpl'] = `${csPk}`
      imwToPop['ovr'] = `${ovr}`

      populated_imw_arr.push(imwToPop) //this holds data for the IMW

      // //v//ADD numPkgs, csPkgMltpl, ovr, reqdRtl, charm, rbDefaultMarg(for dept), appliedMargin, appliedWSdisco, appliedRtlDisco, etc.
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
      reviewObj['Rtl_disco'] = `${reqBody.ongDisco_Rtl}`
      reviewObj['sib_baseprice'] = `${queryResArr[i]['sib_baseprice']}`
      reviewObj['reqdRtl'] = `${reqdRtl}`
      reviewObj['charm'] = `${charm}`
      reviewObj['ediPrice'] = `${queryResArr[i][`${reqBody.venCatPrefix}_msrp`]}`
      reviewObj['idealMarg'] = `${queryResArr[i]['sib_idealmargin']}`
      reviewObj['actlMarg'] = `${queryResArr[i]['actlMarg']}`
      reviewObj['appliedMargin'] = `${marginToApply*100}`
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
      console.log(`queryResArrCache['data']['queryResArrCache_key']['v'].length==> ${queryResArrCache['data']['queryResArrCache_key']['v'].length}`)
      console.log(`queryResArrCache['data']['queryResArrCache_key']['v'][0]==> ${queryResArrCache['data']['queryResArrCache_key']['v'][0]}`)
      console.log(`JSON.stringify(queryResArrCache['data']['queryResArrCache_key']['v'][0])==> ${JSON.stringify(queryResArrCache['data']['queryResArrCache_key']['v'][0])}`)
      //^// CACHE QUERY RESULTS IN BACKEND //////////////////////////////////////////////////////////////////////////////

      // //^//ADD numPkgs, csPkgMltpl, ovr, reqdRtl, charm, rbDefaultMarg(for dept), appliedMargin, appliedWSdisco, appliedRtlDisco
      // //^//to modifiedQueryResArr, in order to show for review purposes on frontend
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////
  }
}
export {
  retailCalcs
}