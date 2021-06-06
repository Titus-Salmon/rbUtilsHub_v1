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

  console.log(
    "tblCells[0].parentNode.childNodes[0].innerHTML==>",
    tblCells[0].parentNode.childNodes[0].innerHTML
  );

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

  console.log(`ediCostModColOffset==> ${ediCostModColOffset}`);
  console.log(`charmColOffset==> ${charmColOffset}`);

  for (let k = 0; k < tblCells.length; k++) {
    for (let m = 0; m < tblCols.length; m++) {
      if (tblCols[m] === "lastCost") {
        lastCost_cell = tblCells[k].parentNode.childNodes[m];
      }
      if (tblCols[m] === "ediCostMod") {
        ediCostMod_cell = tblCells[k].parentNode.childNodes[m];
        let rowNum = (k - ediCostModColOffset) / ediCostModColNum;
        if (rowNum % 2 == 0) {
          //clear all highlighting as first step, in order that subsequent paginations don't retain highlighting from previous page
          ediCostMod_cell.style.backgroundColor = "black";
          ediCostMod_cell.style.color = "lime";
        } else {
          //clear all highlighting as first step, in order that subsequent paginations don't retain highlighting from previous page
          ediCostMod_cell.style.backgroundColor = "var(--surface2)";
          ediCostMod_cell.style.color = "lime";
        }
      }
      if (tblCols[m] === "sib_baseprice") {
        basePrice_cell = tblCells[k].parentNode.childNodes[m];
      }
      if (tblCols[m] === "charm") {
        charm_cell = tblCells[k].parentNode.childNodes[m];
        let rowNum = (k - charmColOffset) / charmColNum;
        if (rowNum % 2 == 0) {
          //clear all highlighting as first step, in order that subsequent paginations don't retain highlighting from previous page
          charm_cell.style.backgroundColor = "black";
          charm_cell.style.color = "lime";
        } else {
          //clear all highlighting as first step, in order that subsequent paginations don't retain highlighting from previous page
          charm_cell.style.backgroundColor = "var(--surface2)";
          charm_cell.style.color = "lime";
        }
      }
    }
    // if (ediCostMod_cell && lastCost_cell) {
    //   //only do calcs on these cells if they exist (because sometimes your table results
    //   //won't include such cells/columns), otherwise you'll throw an error
    // }

    // if (charm_cell && basePrice_cell) {
    //   //only do calcs on these cells if they exist (because sometimes your table results
    //   //won't include such cells/columns), otherwise you'll throw an error
    // }
  }
}

export { resetCells };
