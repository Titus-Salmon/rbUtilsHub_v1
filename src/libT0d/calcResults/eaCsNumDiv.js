let unitCost;

function eaCsNumDiv(n, reqBody, queryResArr, discoMulti) {
  let venCatPrefix = reqBody.venCatPrefix;
  let oup_name_string = queryResArr[n]["oup_name"];
  oup_name_string = oup_name_string.toLowerCase();
  let eaCsNum = queryResArr[n]["oup_name"].split("-")[1]; //isolate the number portion of EA/CS-##
  let venCost = queryResArr[n][`${venCatPrefix}_cost`]; //get cost from vendor catalog

  if (oup_name_string.includes("ea-")) {
    if (reqBody.eaNumDivide === "yes") {
      //domathToGetToUnitCost
      unitCost = venCost / eaCsNum - (venCost / eaCsNum) * discoMulti;
    } else {
      unitCost = venCost - venCost * discoMulti;
    }
    unitCost = Math.round(unitCost * 100) / 100; //rounding unit cost off to 2 decimal places
  }

  if (oup_name_string.includes("cs-")) {
    if (reqBody.csNumDivide === "yes") {
      //domathToGetToUnitCost
      unitCost = venCost / eaCsNum - (venCost / eaCsNum) * discoMulti;
    } else {
      unitCost = venCost - venCost * discoMulti;
    }
    unitCost = Math.round(unitCost * 100) / 100; //rounding unit cost off to 2 decimal places
  }
}

function lbNumDiv(n, reqBody, queryResArr, discoMulti) {
  let venCatPrefix = reqBody.venCatPrefix;
  let oup_name_string = queryResArr[n]["oup_name"];
  oup_name_string = oup_name_string.toLowerCase();

  if (oup_name_string.includes("lb-")) {
    console.log(`oup_name_string==> ${oup_name_string}`);
    let lbNum = queryResArr[n]["oup_name"].split("-")[1]; //isolate the number portion of LB-##
    let venCost = queryResArr[n][`${venCatPrefix}_cost`]; //get cost from vendor catalog
    if (reqBody.lbNumDivide === "yes") {
      //domathToGetToUnitCost
      unitCost = venCost / lbNum - (venCost / lbNum) * discoMulti;
      console.log(`unitCost from within lbNumDiv==> ${unitCost}`);
    } else {
      unitCost = venCost - venCost * discoMulti;
    }
    unitCost = Math.round(unitCost * 100) / 100; //rounding unit cost off to 2 decimal places
  }
}

function ozNumDiv(n, reqBody, queryResArr, discoMulti) {
  let venCatPrefix = reqBody.venCatPrefix;
  let oup_name_string = queryResArr[n]["oup_name"];
  oup_name_string = oup_name_string.toLowerCase();

  if (oup_name_string.includes("oz-")) {
    console.log(`oup_name_string==> ${oup_name_string}`);
    let ozNum = queryResArr[n]["oup_name"].split("-")[1]; //isolate the number portion of LB-##
    let venCost = queryResArr[n][`${venCatPrefix}_cost`]; //get cost from vendor catalog
    if (reqBody.ozNumDivide === "yes") {
      //domathToGetToUnitCost
      unitCost = venCost / ozNum - (venCost / ozNum) * discoMulti;
      console.log(`unitCost from within ozNumDiv==> ${unitCost}`);
    } else {
      unitCost = venCost - venCost * discoMulti;
    }
    unitCost = Math.round(unitCost * 100) / 100; //rounding unit cost off to 2 decimal places
  }
}

function ctNumDiv(n, reqBody, queryResArr, discoMulti) {
  let venCatPrefix = reqBody.venCatPrefix;
  let oup_name_string = queryResArr[n]["oup_name"];
  oup_name_string = oup_name_string.toLowerCase();

  if (oup_name_string.includes("ct-")) {
    console.log(`oup_name_string==> ${oup_name_string}`);
    let ctNum = queryResArr[n]["oup_name"].split("-")[1]; //isolate the number portion of LB-##
    let venCost = queryResArr[n][`${venCatPrefix}_cost`]; //get cost from vendor catalog
    if (reqBody.ctNumDivide === "yes") {
      //domathToGetToUnitCost
      unitCost = venCost / ctNum - (venCost / ctNum) * discoMulti;
      console.log(`unitCost from within ctNumDiv==> ${unitCost}`);
    } else {
      unitCost = venCost - venCost * discoMulti;
    }
    unitCost = Math.round(unitCost * 100) / 100; //rounding unit cost off to 2 decimal places
  }
}

function altIDqtyDiv(n, reqBody, queryResArr, discoMulti) {
  if (reqBody.altIDqtyDiv === "yes") {
    let altIDqty = queryResArr[n]["pkgQnt"]; //the # in pkgQnt column (alt ID qty #)
    if (altIDqty > 1) {
      //only do calcs if there is some #>1 in pkgQty field
      let venCost = queryResArr[n][`${venCatPrefix}_cost`]; //get cost from vendor catalog
      //domathToGetToUnitCost
      unitCost = venCost / altIDqty - (venCost / altIDqty) * discoMulti;
      unitCost = Math.round(unitCost * 100) / 100; //rounding unit cost off to 2 decimal places
      console.log(`unitCost from within altIDqtyDiv==> ${unitCost}`);
    }
  }
}

export { unitCost, eaCsNumDiv, lbNumDiv, ozNumDiv, ctNumDiv, altIDqtyDiv };
