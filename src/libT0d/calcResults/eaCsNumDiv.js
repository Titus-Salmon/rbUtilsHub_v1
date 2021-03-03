let unitCost;

function eaCsNumDiv(n) {
  let eaCsNum = queryResArr[n]['oup_name'].split('-')[1]
  let venCost = queryResArr[n][`${venCatPrefix}_cost`]
  if (req.body.eaCsNumDivide === 'yes') {
    //domathToGetToUnitCost
    unitCost = (venCost / eaCsNum) - (venCost / eaCsNum) * discoMulti
  } else {
    unitCost = venCost - venCost * discoMulti
  }
}

export {
  unitCost,
  eaCsNumDiv
}