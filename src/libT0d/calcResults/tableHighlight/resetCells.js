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

  let totalCells = tblCells.length;
  let cellsInRow = tblCols.length;
  let totalRows = totalCells / cellsInRow;

  for (let x = 0; x < totalRows; x++) {
    for (let y = 0; y < totalCells; y++) {}
  }

  console.log(
    "tblCells[0].parentNode.childNodes[0].innerHTML==>",
    tblCells[0].parentNode.childNodes[0].innerHTML
  );

  console.log(`tblCols.length==> ${tblCols.length}`);

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

  console.log(`ediCostModColNum==> ${ediCostModColNum}`);
  console.log(`typeof ediCostModColNum==> ${typeof ediCostModColNum}`);

  console.log(`ediCostModColOffset==> ${ediCostModColOffset}`);
  console.log(`typeof ediCostModColOffset==> ${typeof ediCostModColOffset}`);

  console.log(`charmColNum==> ${charmColNum}`);
  console.log(`typeof charmColNum==> ${typeof charmColNum}`);

  console.log(`charmColOffset==> ${charmColOffset}`);
  console.log(`typeof charmColOffset==> ${typeof charmColOffset}`);

  for (let k = 0; k < tblCells.length; k++) {
    for (let m = 0; m < tblCols.length; m++) {
      if (tblCols[m] === "lastCost") {
        lastCost_cell = tblCells[k].parentNode.childNodes[m];
      }
      if (tblCols[m] === "ediCostMod") {
        ediCostMod_cell = tblCells[k].parentNode.childNodes[m];
        // let testNumberCostMod =
        //   (k + 1 - ediCostModColOffset) / ediCostModColNum;
        // if (Number.isInteger(testNumberCostMod)) {
        // console.log(`testNumberCostMod==> ${testNumberCostMod}`);
        let a = k + 1;
        let b = ediCostModColOffset;
        let c = ediCostModColNum;
        let d = tblCols.length;
        let rowNumCostMod = (a - b * ((a - c) / d)) / c;
        if (Number.isInteger(rowNumCostMod)) {
          console.log(`row # from ediCostMod calcs==>  ${rowNumCostMod}`);
          if (ediCostModColNum / (k + 1) === 1 || rowNumCostMod % 2 === 0) {
            //clear all highlighting as first step, in order that subsequent paginations don't retain highlighting from previous page
            ediCostMod_cell.style.backgroundColor = "black";
            ediCostMod_cell.style.color = "lime";
          } else {
            //clear all highlighting as first step, in order that subsequent paginations don't retain highlighting from previous page
            ediCostMod_cell.style.backgroundColor = "var(--surface2)";
            ediCostMod_cell.style.color = "lime";
          }
        }
        //}
      }
      if (tblCols[m] === "sib_baseprice") {
        basePrice_cell = tblCells[k].parentNode.childNodes[m];
      }
      if (tblCols[m] === "charm") {
        charm_cell = tblCells[k].parentNode.childNodes[m];
        // let testNumberCharm = (k + 1 - charmColOffset) / charmColNum;
        // if (Number.isInteger(testNumberCharm)) {
        //   console.log(`testNumberCharm==> ${testNumberCharm}`);
        let a = k + 1;
        let b = charmColOffset;
        let c = charmColNum;
        let d = tblCols.length;
        let rowNumCharm = (a - b * ((a - c) / d)) / c;
        if (Number.isInteger(rowNumCharm)) {
          console.log(`row # from charm calcs==>  ${rowNumCharm}`);
          if (charmColNum / (k + 1) === 1 || rowNumCharm % 2 === 0) {
            //clear all highlighting as first step, in order that subsequent paginations don't retain highlighting from previous page
            charm_cell.style.backgroundColor = "black";
            charm_cell.style.color = "lime";
          } else {
            //clear all highlighting as first step, in order that subsequent paginations don't retain highlighting from previous page
            charm_cell.style.backgroundColor = "var(--surface2)";
            charm_cell.style.color = "lime";
          }
        }
        //}
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
