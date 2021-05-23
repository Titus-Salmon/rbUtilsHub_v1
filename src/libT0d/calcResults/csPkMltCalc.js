let csPk;
let ovr;

function csPkMltCalc(n, queryResArr, reqBody) {
  //sets WebOffice Case Pack Multiple value (the ## in EA-##)
  csPk = "";
  ovr = "";
  let oupNameLetters = queryResArr[n]["oup_name"].split("-")[0];
  if (oupNameLetters.toLowerCase() === "ea") {
    csPk = queryResArr[n]["oup_name"].split("-")[1];
    if (reqBody.purchQtyOverride == "yes") {
      ovr = "1";
    }
    if (reqBody.purchQtyOverride == "no") {
      ovr = "0";
    }
    if (reqBody.purchQtyOverride == "doNothing") {
      ovr = "";
    }
  }
}

export { csPk, ovr, csPkMltCalc };
