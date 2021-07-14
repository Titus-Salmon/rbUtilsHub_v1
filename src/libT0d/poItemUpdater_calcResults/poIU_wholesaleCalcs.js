import { blank_imw_creator } from "../imw/blank_imw_creator";

import {
  unitCost,
  poIU_eaCsNumDiv,
  poIU_lbNumDiv,
  poIU_ozNumDiv,
  poIU_ctNumDiv,
  poIU_altIDqtyDiv,
} from "../../libT0d/poItemUpdater_calcResults/poIU_eaCsNumDiv";

import { nmPk, numPkgsCalc } from "../../libT0d/calcResults/numPkgsCalc";

import { csPk, ovr, csPkMltCalc } from "../../libT0d/calcResults/csPkMltCalc";

import queryResArrCache from "../../nodeCacheStuff/cache1"; //we will use this to overwrite the queryResArrCache initially set from
//within rbDBqueryResults, so that we display only what we want to display for review purposes.

function poIU_wholesaleCalcs(
  reqBody,
  queryResArr,
  populated_imw_arr,
  modifiedQueryResArr,
  calcResStatus
) {
  //populate imw with wholesales from PO

  //the following fields need to be populated for WS IMW:
  //Item ID(UPC), Last Cost, Ideal Margin(?), Supplier Unit ID(SKU), Supplier ID(EDI-VENDORNAME), Num Pkgs,
  //Case Pk Mult, Ovr, PF1, PF2, PF5(YYYY-MM-DD WS UPDT(pf5)), PF6(EDI-VENDORNAME)

  //lay out logic for
  //[1] wholesale calcs, taking into account:

  console.log(`queryResArr.length from populateIMW()==> ${queryResArr.length}`);
  for (let i = 0; i < queryResArr.length; i++) {
    // let commitUnitCost =
    //   queryResArr[i]["POD_CommitCost"] / queryResArr[i]["POD_ORDQuantity"];
    // let lastCost = queryResArr[i]["inv_lastcost"];
    // //convert both lastCost and commitUnitCost to rounded ##.## format
    // //(because if one is, say, 21.990 and the other is 21.99, they weill be considered different)
    // commitUnitCost = Math.round(commitUnitCost * 100) / 100;
    unitCost = Math.round(unitCost * 100) / 100;
    lastCost = Math.round(lastCost * 100) / 100;

    poIU_eaCsNumDiv(i, reqBody, queryResArr);
    poIU_lbNumDiv(i, reqBody, queryResArr);
    poIU_ozNumDiv(i, reqBody, queryResArr);
    poIU_ctNumDiv(i, reqBody, queryResArr);
    poIU_altIDqtyDiv(i, reqBody, queryResArr);

    if (parseFloat(lastCost) < parseFloat(unitCost)) {
      //only include results in need of wholesale update; lastCost < commitUnitCost & item actually received
      let imwToPop = {};
      blank_imw_creator(imwToPop);
      imwToPop["upc"] = `${queryResArr[i]["inv_ScanCode"]}`;
      imwToPop["sugstdRtl"] = "";
      imwToPop["lastCost"] = `${unitCost}`;
      imwToPop["charm"] = "";
      imwToPop["autoDiscount"] = "";
      imwToPop["idealMarg"] = ``;
      imwToPop["wtPrfl"] = "";
      imwToPop["tax1"] = "";
      imwToPop["tax2"] = "";
      imwToPop["tax3"] = "";
      imwToPop["spclTndr1"] = "";
      imwToPop["spclTndr2"] = "";
      imwToPop["posPrmpt"] = "";
      imwToPop["lctn"] = "";
      imwToPop["altID"] = "";
      imwToPop["altRcptAlias"] = "";
      imwToPop["pkgQnt"] = "";

      imwToPop["imwSKU"] = `${queryResArr[i]["ord_supplierstocknumber"]}`;

      imwToPop["splrID"] = `${queryResArr[i]["ven_companyname"]}`;
      imwToPop["unit"] = `${queryResArr[i]["oup_name"]}`;
      imwToPop["numPkgs"] = "";
      imwToPop["pf1"] = `${queryResArr[i]["pi1_description"]}`;
      imwToPop["pf2"] = `${queryResArr[i]["pi2_description"]}`;
      imwToPop["pf3"] = "";
      imwToPop["pf4"] = "";
      imwToPop["pf5"] = `${
        new Date().toISOString().split("T", 1)[0]
      } po_WS UPDT (pf5)`; //Power Field 5 - today's date
      imwToPop["pf6"] = `${queryResArr[i]["ven_companyname"]}`;
      imwToPop["pf7"] = "";
      imwToPop["pf8"] = "";
      imwToPop["onhndQnt"] = "";
      imwToPop["rdrPnt"] = "";
      imwToPop["mcl"] = "";
      imwToPop["rdrQnt"] = "";
      imwToPop["memo"] = "";
      imwToPop["flrRsn"] = "";
      imwToPop["dsd"] = "";
      imwToPop["dscMltplr"] = "";
      imwToPop["csPkgMltpl"] = "";
      imwToPop["ovr"] = "";

      populated_imw_arr.push(imwToPop);
      // modifiedQueryResArr.push(queryResArr[i])

      ////////////////////////////////////////////////////////////////////////////////////
      // //v//ADD numPkgs, csPkgMltpl, ovr, appliedWSdisco, etc.
      // //v//to modifiedQueryResArr, in order to show for review purposes on frontend
      let reviewObj = {};
      reviewObj["upc"] = `${queryResArr[i]["inv_ScanCode"]}`;
      reviewObj["cpltSKU"] = `${queryResArr[i]["ord_supplierstocknumber"]}`;
      reviewObj["deptName"] = `${queryResArr[i]["dpt_name"]}`;
      reviewObj["rcptAlias"] = `${queryResArr[i]["inv_receiptalias"]}`;
      reviewObj["brand"] = `${queryResArr[i]["brd_name"]}`;
      reviewObj["size"] = `${queryResArr[i]["inv_size"]}`;
      reviewObj["lastCost"] = `${queryResArr[i]["inv_lastcost"]}`;
      reviewObj["unitCost"] = `${unitCost}`;
      reviewObj["sib_baseprice"] = `${queryResArr[i]["sib_baseprice"]}`;
      reviewObj["actlMarg"] = `${queryResArr[i]["actlMarg"]}`;
      reviewObj["altID"] = `${queryResArr[i]["asc_scancode"]}`;
      reviewObj["altRcptAlias"] = `${queryResArr[i]["asc_receiptalias"]}`;
      reviewObj["pkgQnt"] = `${queryResArr[i]["asc_quantity"]}`; //***this is pkg qty for ALD ID***
      reviewObj["splrID"] = `${queryResArr[i]["ven_companyname"]}`;
      reviewObj["unit"] = `${queryResArr[i]["oup_name"]}`;
      reviewObj["store"] = `${queryResArr[i]["sto_number"]}`;
      reviewObj["numPkgs"] = ``;
      reviewObj["csPkgMltpl"] = ``;
      reviewObj["ovr"] = ``;
      reviewObj["dsc"] = `${queryResArr[i]["inv_discontinued"]}`;
      reviewObj["pf1"] = `${queryResArr[i]["pi1_description"]}`;
      reviewObj["pf2"] = `${queryResArr[i]["pi2_description"]}`;

      modifiedQueryResArr.push(reviewObj); //this holds data for displaying REVIEW results
      //AND we are adding some calcResults as well (see above), for review purposes
      //we need some way of reordering our columns for the review array (modifiedQueryResArr), so why not
      //just overwrite your cache with the review results, and everything should fall in place
      //V// CACHE QUERY RESULTS IN BACKEND (for saveToCSV, and possibly other things)//////////////////////////////////////////////////////////////////////////////
      queryResArrCache.set("queryResArrCache_key", modifiedQueryResArr);
      //^// CACHE QUERY RESULTS IN BACKEND //////////////////////////////////////////////////////////////////////////////

      // //^//ADD numPkgs, csPkgMltpl, ovr, appliedWSdisco, etc.
      // //^//to modifiedQueryResArr, in order to show for review purposes on frontend
    }
  }
  calcResStatus = `There were ${populated_imw_arr.length} items in need of wholesale update. 
  populated_imw_arr.length = ${populated_imw_arr.length}`;
}

export { poIU_wholesaleCalcs };
