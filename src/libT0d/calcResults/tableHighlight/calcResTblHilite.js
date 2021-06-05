function calcResTblHilite(tblData) {
  const rsltTblBdy = document.getElementById("rsltTblBdy");
  let tblCells = rsltTblBdy.getElementsByTagName("td"); //targets all cells in table

  let tblCols = Object.keys(tblData[0]);

  let lastCost_cell;
  let ediCostMod_cell;
  let basePrice_cell;
  let charm_cell;

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
      }
      if (tblCols[m] === "sib_baseprice") {
        basePrice_cell = tblCells[k].parentNode.childNodes[m];
      }
      if (tblCols[m] === "charm") {
        charm_cell = tblCells[k].parentNode.childNodes[m];
      }
    }
    if (ediCostMod_cell && lastCost_cell) {
      //only do calcs on these cells if they exist (because sometimes your table results
      //won't include such cells/columns), otherwise you'll throw an error

      //clear all highlighting as first step, in order that subsequent paginations don't retain highlighting from previous page
      ediCostMod_cell.style.backgroundColor = "black";
      ediCostMod_cell.style.color = "lime";
      if (
        Math.abs(
          (parseFloat(ediCostMod_cell.innerHTML) -
            parseFloat(lastCost_cell.innerHTML)) /
            parseFloat(ediCostMod_cell.innerHTML)
        ) > 0.5
      ) {
        ediCostMod_cell.style.backgroundColor = "#ff8533";
        ediCostMod_cell.style.color = "black";
      } else {
        if (
          Math.abs(
            (parseFloat(ediCostMod_cell.innerHTML) -
              parseFloat(lastCost_cell.innerHTML)) /
              parseFloat(ediCostMod_cell.innerHTML)
          ) > 0.35
        ) {
          ediCostMod_cell.style.backgroundColor = "#ffb3ca";
          ediCostMod_cell.style.color = "black";
        }
      }
    }

    if (charm_cell && basePrice_cell) {
      //only do calcs on these cells if they exist (because sometimes your table results
      //won't include such cells/columns), otherwise you'll throw an error

      //clear all highlighting as first step, in order that subsequent paginations don't retain highlighting from previous page
      ediCostMod_cell.style.backgroundColor = "black";
      ediCostMod_cell.style.color = "lime";
      if (
        Math.abs(
          (parseFloat(charm_cell.innerHTML) -
            parseFloat(basePrice_cell.innerHTML)) /
            parseFloat(charm_cell.innerHTML)
        ) > 0.5
      ) {
        charm_cell.style.backgroundColor = "#ff0000";
        charm_cell.style.color = "black";
      } else {
        if (
          Math.abs(
            (parseFloat(charm_cell.innerHTML) -
              parseFloat(basePrice_cell.innerHTML)) /
              parseFloat(charm_cell.innerHTML)
          ) > 0.35
        ) {
          charm_cell.style.backgroundColor = "#ffdb4b";
          charm_cell.style.color = "black";
        }
      }
    }
  }
}

export { calcResTblHilite };
