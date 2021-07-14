let unitCost;

function poIU_eaCsNumDiv(n, reqBody, queryResArr) {
  // let venCatPrefix = reqBody.venCatPrefix;
  let oup_name_string = queryResArr[n]["oup_name"];
  oup_name_string = oup_name_string.toLowerCase();
  let eaCsNum = queryResArr[n]["oup_name"].split("-")[1]; //isolate the number portion of EA/CS-##
  let venCost = queryResArr[n][`POD_CommitCost`]; //get cost from PO

  if (oup_name_string.includes("ea-")) {
    if (reqBody.eaNumDivide === "yes") {
      //domathToGetToUnitCost
      unitCost = venCost / eaCsNum;
    } else {
      unitCost = venCost;
    }
    unitCost = Math.round(unitCost * 100) / 100; //rounding unit cost off to 2 decimal places
  }

  if (oup_name_string.includes("cs-")) {
    if (reqBody.csNumDivide === "yes") {
      //domathToGetToUnitCost
      unitCost = venCost / eaCsNum;
    } else {
      unitCost = venCost;
    }
    unitCost = Math.round(unitCost * 100) / 100; //rounding unit cost off to 2 decimal places
  }
}

function poIU_lbNumDiv(n, reqBody, queryResArr) {
  // let venCatPrefix = reqBody.venCatPrefix;
  let oup_name_string = queryResArr[n]["oup_name"];
  oup_name_string = oup_name_string.toLowerCase();

  if (oup_name_string.includes("lb-")) {
    console.log(`oup_name_string==> ${oup_name_string}`);
    let lbNum = queryResArr[n]["oup_name"].split("-")[1]; //isolate the number portion of LB-##
    let venCost = queryResArr[n][`POD_CommitCost`]; //get cost from PO
    if (reqBody.lbNumDivide === "yes") {
      //domathToGetToUnitCost
      unitCost = venCost / lbNum;
      console.log(`unitCost from within lbNumDiv==> ${unitCost}`);
    } else {
      unitCost = venCost;
    }
    unitCost = Math.round(unitCost * 100) / 100; //rounding unit cost off to 2 decimal places
  }
}

function poIU_ozNumDiv(n, reqBody, queryResArr, discoMulti) {
  // let venCatPrefix = reqBody.venCatPrefix;
  let oup_name_string = queryResArr[n]["oup_name"];
  oup_name_string = oup_name_string.toLowerCase();

  if (oup_name_string.includes("oz-")) {
    console.log(`oup_name_string==> ${oup_name_string}`);
    let ozNum = queryResArr[n]["oup_name"].split("-")[1]; //isolate the number portion of LB-##
    let venCost = queryResArr[n][`POD_CommitCost`]; //get cost from PO
    if (reqBody.ozNumDivide === "yes") {
      //domathToGetToUnitCost
      unitCost = venCost / ozNum;
      console.log(`unitCost from within ozNumDiv==> ${unitCost}`);
    } else {
      unitCost = venCost;
    }
    unitCost = Math.round(unitCost * 100) / 100; //rounding unit cost off to 2 decimal places
  }
}

function poIU_ctNumDiv(n, reqBody, queryResArr, discoMulti) {
  // let venCatPrefix = reqBody.venCatPrefix;
  let oup_name_string = queryResArr[n]["oup_name"];
  oup_name_string = oup_name_string.toLowerCase();

  if (oup_name_string.includes("ct-")) {
    console.log(`oup_name_string==> ${oup_name_string}`);
    let ctNum = queryResArr[n]["oup_name"].split("-")[1]; //isolate the number portion of LB-##
    let venCost = queryResArr[n][`POD_CommitCost`]; //get cost from PO
    if (reqBody.ctNumDivide === "yes") {
      //domathToGetToUnitCost
      unitCost = venCost;
      console.log(`unitCost from within ctNumDiv==> ${unitCost}`);
    } else {
      unitCost = venCost;
    }
    unitCost = Math.round(unitCost * 100) / 100; //rounding unit cost off to 2 decimal places
  }
}

function poIU_altIDqtyDiv(n, reqBody, queryResArr, discoMulti) {
  // let venCatPrefix = reqBody.venCatPrefix;
  if (reqBody.altIDqtyDiv === "yes") {
    let altIDqty = queryResArr[n]["asc_quantity"]; //the # in pkgQnt column (alt ID qty #)
    if (altIDqty > 1) {
      //only do calcs if there is some #>1 in pkgQty field
      let venCost = queryResArr[n][`POD_CommitCost`]; //get cost from PO
      //domathToGetToUnitCost
      unitCost = venCost / altIDqty;
      unitCost = Math.round(unitCost * 100) / 100; //rounding unit cost off to 2 decimal places
      console.log(`unitCost from within altIDqtyDiv==> ${unitCost}`);
    }
  }
}

export {
  unitCost,
  poIU_eaCsNumDiv,
  poIU_lbNumDiv,
  poIU_ozNumDiv,
  poIU_ctNumDiv,
  poIU_altIDqtyDiv,
};
