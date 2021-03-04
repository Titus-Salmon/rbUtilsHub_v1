let csPk;
let ovr;

function csPkMltCalc(n, queryResArr) {
  csPk = ""
  ovr = ""
  let oupNameLetters = queryResArr[n]['oup_name'].split('-')[0]
  if (oupNameLetters.toLowerCase() === 'ea') {
    csPk = queryResArr[n]['oup_name'].split('-')[1]
    ovr = "1"
  }
}

export {
  csPk,
  ovr,
  csPkMltCalc
}