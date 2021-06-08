function resetCells(tblData, columnName) {
  const rsltTblBdy = document.getElementById("rsltTblBdy");
  let tblCells = rsltTblBdy.getElementsByTagName("td"); //targets all cells in table

  let tblCols = Object.keys(tblData[0]);

  for (let k = 0; k < tblCells.length; k++) {
    for (let m = 0; m < tblCols.length; m++) {
      if (tblCols[m] === columnName) {
        let cell = tblCells[k].parentNode.childNodes[m];
        let colNum = m + 1;
        let colOffset = tblCols.length - colNum;
        let a = k + 1;
        let b = colOffset;
        let c = colNum;
        let d = tblCols.length;
        let rowNum = (a - b * ((a - c) / d)) / c; //this is the equation that figures out row number based on what number of cell we're
        //iterating across. I figured this out just by examining an example table and abstracting the logic
        if (Number.isInteger(rowNum)) {
          if (colNum / (k + 1) === 1) {
            //clear all highlighting as first step, in order that subsequent paginations don't retain highlighting from previous page
            cell.style.backgroundColor = "black";
            cell.style.color = "lime";
          }
          if (rowNum % 2 === 0) {
            //clear all highlighting as first step, in order that subsequent paginations don't retain highlighting from previous page
            cell.style.backgroundColor = "var(--surface2)";
            cell.style.color = "lime";
          } else {
            //clear all highlighting as first step, in order that subsequent paginations don't retain highlighting from previous page
            cell.style.backgroundColor = "black";
            cell.style.color = "lime";
          }
        }
      }
    }
  }
}

export { resetCells };
