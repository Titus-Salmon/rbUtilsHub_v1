let nmPk;

function numPkgsCalc(n, queryResArr) { //sets WebOffice Quantity value (the ## in CS-##)
  let oupNameLetters = queryResArr[n]['oup_name'].split('-')[0]
  if (oupNameLetters.toLowerCase() === 'cs') {
    nmPk = queryResArr[n]['oup_name'].split('-')[1]
  } else {
    nmPk = ""
  }
}

export {
  nmPk,
  numPkgsCalc
}