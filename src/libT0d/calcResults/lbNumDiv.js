let unitCost;

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

function ozNumDiv(n, reqBody, queryResArr, discoMulti) {
  let venCatPrefix = reqBody.venCatPrefix
  let inv_size_string = queryResArr[n]['inv_size']
  inv_size_string = inv_size_string.toLowerCase()

  if (inv_size_string.includes("oz-")) {
    console.log(`inv_size_string==> ${inv_size_string}`)
    let ozNum = queryResArr[n]['inv_size'].split('-')[1] //isolate the number portion of LB-##
    let venCost = queryResArr[n][`${venCatPrefix}_cost`] //get cost from vendor catalog
    if (reqBody.ozNumDivide === 'yes') {
      //domathToGetToUnitCost
      unitCost = (venCost / ozNum) - (venCost / ozNum) * discoMulti
      console.log(`unitCost from within ozNumDiv==> ${unitCost}`)
    } else {
      unitCost = venCost - venCost * discoMulti
    }
    unitCost = Math.round(unitCost * 100) / 100 //rounding unit cost off to 2 decimal places
  }
}

export {
  unitCost,
  lbNumDiv
}