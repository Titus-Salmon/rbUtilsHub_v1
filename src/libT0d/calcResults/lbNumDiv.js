let unitCost;

function lbNumDiv(n, reqBody, queryResArr, discoMulti) {
  let venCatPrefix = reqBody.venCatPrefix
  let inv_size_string = queryResArr[n]['inv_size']
  inv_size_string = inv_size_string.toLowerCase()
  let lb_string = "lb-"
  if (inv_size_string.includes(lb_string)) {
    console.log(`inv_size_string from outside conditional==> ${inv_size_string}`)
  }

  if (inv_size_string.includes(lb_string)) {
    console.log(`inv_size_string==> ${inv_size_string}`)
    let lbNum = queryResArr[n]['inv_size'].split('-')[1] //isolate the number portion of LB-##
    let venCost = queryResArr[n][`${venCatPrefix}_cost`] //get cost from vendor catalog
    if (reqBody.NumDivide === 'yes') {
      //domathToGetToUnitCost
      unitCost = (venCost / lbNum) - (venCost / lbNum) * discoMulti
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