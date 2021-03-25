let unitCost;

function eaCsNumDiv(n, reqBody, queryResArr, discoMulti) {
  let venCatPrefix = reqBody.venCatPrefix
  let eaCsNum = queryResArr[n]['oup_name'].split('-')[1] //isolate the number portion of EA/CS-##
  let venCost = queryResArr[n][`${venCatPrefix}_cost`] //get cost from vendor catalog
  if (reqBody.eaNumDivide === 'yes' || reqBody.csNumDivide === 'yes') {
    //domathToGetToUnitCost
    unitCost = (venCost / eaCsNum) - (venCost / eaCsNum) * discoMulti
  } else {
    unitCost = venCost - venCost * discoMulti
  }
  unitCost = Math.round(unitCost * 100) / 100 //rounding unit cost off to 2 decimal places
}

function lbNumDiv(n, reqBody, queryResArr, discoMulti) {
  let venCatPrefix = reqBody.venCatPrefix
  let inv_size_string = queryResArr[n]['inv_size']
  inv_size_string = inv_size_string.toLowerCase()

  if (inv_size_string.includes("lb-")) {
    console.log(`inv_size_string==> ${inv_size_string}`)
    let lbNum = queryResArr[n]['inv_size'].split('-')[1] //isolate the number portion of LB-##
    let venCost = queryResArr[n][`${venCatPrefix}_cost`] //get cost from vendor catalog
    if (reqBody.lbNumDivide === 'yes') {
      //domathToGetToUnitCost
      unitCost = (venCost / lbNum) - (venCost / lbNum) * discoMulti
      console.log(`unitCost from within lbNumDiv==> ${unitCost}`)
    } else {
      unitCost = venCost - venCost * discoMulti
    }
    unitCost = Math.round(unitCost * 100) / 100 //rounding unit cost off to 2 decimal places
  }
}

export {
  unitCost,
  eaCsNumDiv,
  lbNumDiv
}