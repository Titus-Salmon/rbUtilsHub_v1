function resetCells(tblData) {
  const rsltTblBdy = document.getElementById("rsltTblBdy");
  let tblCells = rsltTblBdy.getElementsByTagName("td"); //targets all cells in table

  let tblCols = Object.keys(tblData[0]);

  let lastCost_cell;
  let ediCostMod_cell;
  let basePrice_cell;
  let charm_cell;
  let ediCostModColNum;
  let ediCostModColOffset;
  let charmColNum;
  let charmColOffset;

  for (let m = 0; m < tblCols.length; m++) {
    if (tblCols[m] === "ediCostMod") {
      ediCostModColNum = m + 1;
      ediCostModColOffset = tblCols.length - ediCostModColNum;
    }
    if (tblCols[m] === "charm") {
      charmColNum = m + 1;
      charmColOffset = tblCols.length - charmColNum;
    }
  }

  for (let k = 0; k < tblCells.length; k++) {
    for (let m = 0; m < tblCols.length; m++) {
      if (tblCols[m] === "lastCost") {
        lastCost_cell = tblCells[k].parentNode.childNodes[m];
      }
      if (tblCols[m] === "ediCostMod") {
        ediCostMod_cell = tblCells[k].parentNode.childNodes[m];
        let a = k + 1;
        let b = ediCostModColOffset;
        let c = ediCostModColNum;
        let d = tblCols.length;
        let rowNumCostMod = (a - b * ((a - c) / d)) / c;
        if (Number.isInteger(rowNumCostMod)) {
          console.log(`row # from ediCostMod calcs==>  ${rowNumCostMod}`);
          if (ediCostModColNum / (k + 1) === 1) {
            //clear all highlighting as first step, in order that subsequent paginations don't retain highlighting from previous page
            ediCostMod_cell.style.backgroundColor = "black";
            ediCostMod_cell.style.color = "lime";
          }
          if (rowNumCostMod % 2 === 0) {
            //clear all highlighting as first step, in order that subsequent paginations don't retain highlighting from previous page
            ediCostMod_cell.style.backgroundColor = "var(--surface2)";
            ediCostMod_cell.style.color = "lime";
          } else {
            //clear all highlighting as first step, in order that subsequent paginations don't retain highlighting from previous page
            ediCostMod_cell.style.backgroundColor = "black";
            ediCostMod_cell.style.color = "lime";
          }
        }
      }
      if (tblCols[m] === "sib_baseprice") {
        basePrice_cell = tblCells[k].parentNode.childNodes[m];
      }
      if (tblCols[m] === "charm") {
        charm_cell = tblCells[k].parentNode.childNodes[m];
        let a = k + 1;
        let b = charmColOffset;
        let c = charmColNum;
        let d = tblCols.length;
        let rowNumCharm = (a - b * ((a - c) / d)) / c;
        if (Number.isInteger(rowNumCharm)) {
          console.log(`row # from charm calcs==>  ${rowNumCharm}`);
          if (charmColNum / (k + 1) === 1) {
            //clear all highlighting as first step, in order that subsequent paginations don't retain highlighting from previous page
            charm_cell.style.backgroundColor = "black";
            charm_cell.style.color = "lime";
          }
          if (rowNumCharm % 2 === 0) {
            //clear all highlighting as first step, in order that subsequent paginations don't retain highlighting from previous page
            charm_cell.style.backgroundColor = "var(--surface2)";
            charm_cell.style.color = "lime";
          } else {
            //clear all highlighting as first step, in order that subsequent paginations don't retain highlighting from previous page
            charm_cell.style.backgroundColor = "black";
            charm_cell.style.color = "lime";
          }
        }
      }
    }
  }
}

export { resetCells };
