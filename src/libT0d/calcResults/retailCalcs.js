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

    eaCsNumDiv(i, reqBody, queryResArr, discoMulti_Rtl)
    numPkgsCalc(i, queryResArr)
    csPkMltCalc(i, queryResArr)

    for (let j = 0; j < stagedDptMargData.length; j++) {
      console.log(`stagedDptMargData[${j}]['dptNumb']==> ${stagedDptMargData[j]['dptNumb']}`)
      if (queryResArr[i]['dpt_number'] === stagedDptMargData[j]['dptNumb']) {
        let marginToApply = stagedDptMargData[j]['margin'] / 100
        console.log(`marginToApply==> ${marginToApply}`)
        console.log(`unitCost==> ${unitCost}`)
        let reqdRtl = unitCost / (1 - marginToApply)
        console.log(`reqdRtl==> ${reqdRtl}`)
        console.log(`typeof reqdRtl==> ${typeof reqdRtl}`)
        reqdRtl = Math.round(reqdRtl * 100) / 100 //convert reqdRtl to rounded 2-decimal-place number
        console.log(`reqdRtl for [${i}] ${queryResArr[i]['inv_ScanCode']}_${queryResArr[i]['inv_name']} ==> ${reqdRtl}`)
      }
    }

    // let catapultRtl = queryResArr[i]['sib_baseprice']

    // if (catapultRtl !== rqdRtl) { //****IMPORTANT!!!!!******this will need to be switched out from "rqdRtl" to "charm"****************
    //   // eaCsNumDiv(i, reqBody, queryResArr, discoMulti_Rtl)
    //   // numPkgsCalc(i, queryResArr)
    //   // csPkMltCalc(i, queryResArr)
    //   let imwToPop = {}
    //   blank_imw_creator(imwToPop)
    //   imwToPop['upc'] = `${queryResArr[i]['inv_ScanCode']}`

    //   // let reqdRtl = unitCost / (1 - marginAsDecimal)
    //   // reqdRtl = Math.round(reqdRtl * 100) / 100 //convert reqdRtl to rounded 2-decimal-place number
    //   imwToPop['sugstdRtl'] = `${charm}` //need -- will be same as charm
    //   imwToPop['lastCost'] = ""
    //   imwToPop['charm'] = `${unitCost}/(${1}-${marginAsDecimal})` //need to do the charm calcs & convert to rounded 2-decimal format
    //   imwToPop['autoDiscount'] = ""
    //   imwToPop['idealMarg'] = `${queryResArr[i]['sib_idealmargin']}`
    //   imwToPop['wtPrfl'] = ""
    //   imwToPop['tax1'] = ""
    //   imwToPop['tax2'] = ""
    //   imwToPop['tax3'] = ""
    //   imwToPop['spclTndr1'] = ""
    //   imwToPop['spclTndr2'] = ""
    //   imwToPop['posPrmpt'] = ""
    //   imwToPop['lctn'] = ""
    //   imwToPop['altID'] = ""
    //   imwToPop['altRcptAlias'] = ""
    //   imwToPop['pkgQnt'] = ""
    //   imwToPop['imwSKU'] = `${queryResArr[i]['ord_supplierstocknumber']}`
    //   imwToPop['splrID'] = `${queryResArr[i]['ven_companyname']}`
    //   imwToPop['unit'] = ""
    //   imwToPop['numPkgs'] = nmPk
    //   imwToPop['pf1'] = `${queryResArr[i]['pi1_description']}`
    //   imwToPop['pf2'] = `${queryResArr[i]['pi2_description']}`
    //   imwToPop['pf3'] = ""
    //   imwToPop['pf4'] = ""
    //   imwToPop['pf5'] = `${new Date().toISOString().split('T', 1)[0]} Rtl UPDT (pf5)` //Power Field 5 - today's date
    //   imwToPop['pf6'] = `${queryResArr[i]['ven_companyname']}`
    //   imwToPop['pf7'] = ""
    //   imwToPop['pf8'] = `actual msrp: ${charm}`
    //   imwToPop['onhndQnt'] = ""
    //   imwToPop['rdrPnt'] = ""
    //   imwToPop['mcl'] = ""
    //   imwToPop['rdrQnt'] = ""
    //   imwToPop['memo'] = ""
    //   imwToPop['flrRsn'] = ""
    //   imwToPop['dsd'] = ""
    //   imwToPop['dscMltplr'] = ""
    //   imwToPop['csPkgMltpl'] = csPk
    //   imwToPop['ovr'] = ovr

    //   populated_imw_arr.push(imwToPop)
    //   modifiedQueryResArr.push(queryResArr[i])
    // }
  }
  calcResStatus = `There were ${populated_imw_arr.length} items in need of retail update. 
  populated_imw_arr.length = ${populated_imw_arr.length}`
}

export {
  retailCalcs
}