let unitCost;

function eaCsNumDiv(n, reqBody) {
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

export {
  unitCost,
  eaCsNumDiv
}