function resetCells(tblData) {
  const rsltTblBdy = document.getElementById("rsltTblBdy");
  let tblCells = rsltTblBdy.getElementsByTagName("td"); //targets all cells in table

  let tblCols = Object.keys(tblData[0]);

  let lastCost_cell;
  let ediCostMod_cell;
  let basePrice_cell;
  let charm_cell;

  let ediCostMod_cell_array = [];
  let charm_cell_array = [];

  console.log(
    "tblCells[0].parentNode.childNodes[0].innerHTML==>",
    tblCells[0].parentNode.childNodes[0].innerHTML
  );

  for (let k = 0; k < tblCells.length; k++) {
    for (let m = 0; m < tblCols.length; m++) {
      if (tblCols[m] === "lastCost") {
        lastCost_cell = tblCells[k].parentNode.childNodes[m];
      }
      if (tblCols[m] === "ediCostMod") {
        ediCostMod_cell = tblCells[k].parentNode.childNodes[m];
        ediCostMod_cell_array.push(k);

        // for (let i = 0; i < ediCostMod_cell_array.length; i++) {
        //   if (i % 2 == 0) {
        //     ediCostMod_cell.style.backgroundColor = "black";
        //     ediCostMod_cell.style.color = "lime";
        //   } else {
        //     ediCostMod_cell.style.backgroundColor = "var(--surface2)";
        //     ediCostMod_cell.style.color = "lime";
        //   }
        // }

        // if (m % 2 == 0) {
        //   if (k % 2 == 0) {
        //     ediCostMod_cell.style.backgroundColor = "black";
        //     ediCostMod_cell.style.color = "lime";
        //   } else {
        //     ediCostMod_cell.style.backgroundColor = "var(--surface2)";
        //     ediCostMod_cell.style.color = "lime";
        //   }
        // }
        // if (m % 2 !== 0) {
        //   if (k % 2 == 0) {
        //     ediCostMod_cell.style.backgroundColor = "var(--surface2)";
        //     ediCostMod_cell.style.color = "lime";
        //   } else {
        //     ediCostMod_cell.style.backgroundColor = "black";
        //     ediCostMod_cell.style.color = "lime";
        //   }
        // }
      }
      if (tblCols[m] === "sib_baseprice") {
        basePrice_cell = tblCells[k].parentNode.childNodes[m];
      }
      if (tblCols[m] === "charm") {
        charm_cell = tblCells[k].parentNode.childNodes[m];
        charm_cell_array.push(k);

        // for (let i = 0; i < charm_cell_array.length; i++) {
        //   if (i % 2 == 0) {
        //     charm_cell.style.backgroundColor = "black";
        //     charm_cell.style.color = "lime";
        //   } else {
        //     charm_cell.style.backgroundColor = "var(--surface2)";
        //     charm_cell.style.color = "lime";
        //   }
        // }

        // if (m % 2 == 0) {
        //   if (k % 2 == 0) {
        //     charm_cell.style.backgroundColor = "black";
        //     charm_cell.style.color = "lime";
        //   } else {
        //     charm_cell.style.backgroundColor = "var(--surface2)";
        //     charm_cell.style.color = "lime";
        //   }
        // }
        // if (m % 2 !== 0) {
        //   if (k % 2 == 0) {
        //     charm_cell.style.backgroundColor = "var(--surface2)";
        //     charm_cell.style.color = "lime";
        //   } else {
        //     charm_cell.style.backgroundColor = "black";
        //     charm_cell.style.color = "lime";
        //   }
        // }
      }
    }
    if (ediCostMod_cell && lastCost_cell) {
      //only do calcs on these cells if they exist (because sometimes your table results
      //won't include such cells/columns), otherwise you'll throw an error
      //clear all highlighting as first step, in order that subsequent paginations don't retain highlighting from previous page
      // ediCostMod_cell.style.backgroundColor = "black";
      // ediCostMod_cell.style.color = "lime";
    }

    if (charm_cell && basePrice_cell) {
      //only do calcs on these cells if they exist (because sometimes your table results
      //won't include such cells/columns), otherwise you'll throw an error
      //clear all highlighting as first step, in order that subsequent paginations don't retain highlighting from previous page
      // charm_cell.style.backgroundColor = "black";
      // charm_cell.style.color = "lime";
    }
  }

  console.log(
    `ediCostMod_cell_array.length==> ${ediCostMod_cell_array.length}`
  );
  console.log(`charm_cell_array.length==> ${charm_cell_array.length}`);

  for (let i = 0; i < ediCostMod_cell_array.length; i++) {
    for (let k = 0; k < tblCells.length; k++) {
      for (let m = 0; m < tblCols.length; m++) {
        if (tblCols[m] === "ediCostMod") {
          ediCostMod_cell = tblCells[k].parentNode.childNodes[m];
        }
        if (i % 2 == 0) {
          ediCostMod_cell.style.backgroundColor = "black";
          ediCostMod_cell.style.color = "lime";
        } else {
          ediCostMod_cell.style.backgroundColor = "var(--surface2)";
          ediCostMod_cell.style.color = "lime";
        }
      }
    }
  }

  for (let i = 0; i < charm_cell_array.length; i++) {
    for (let k = 0; k < tblCells.length; k++) {
      for (let m = 0; m < tblCols.length; m++) {
        if (tblCols[m] === "charm") {
          charm_cell = tblCells[k].parentNode.childNodes[m];
        }
        if (i % 2 == 0) {
          charm_cell.style.backgroundColor = "black";
          charm_cell.style.color = "lime";
        } else {
          charm_cell.style.backgroundColor = "var(--surface2)";
          charm_cell.style.color = "lime";
        }
      }
    }
  }
}

export { resetCells };
