<script>
import tableData from "../../stores/dynamicTables/tableData1";

// let exist_ws = cells[i].parentNode.childNodes[14];
// let edi_cost_mod = cells[i].parentNode.childNodes[16];
// let charm_price = cells[i].parentNode.childNodes[19];
// let crnt_pr_cplt = cells[i].parentNode.childNodes[21];
// let lastCost_cell;
// let ediCostMod_cell;

function tableHighlight() {
  const rsltTblBdy = document.getElementById("rsltTblBdy");
  const tblCells = rsltTblBdy.getElementsByTagName("td"); //targets all cells in table

  let tblCols = Object.keys($tableData[0]);

  let lastCost_cell;
  let ediCostMod_cell;

  for (let k = 0; k < tblCells.length; k++) {
    for (let l = 0; l < tblCols.length; l++) {
      if (tblCols[l] === "lastCost") {
        lastCost_cell = tblCells[k].parentNode.childNodes[l];
      }
      if (tblCols[l] === "ediCostMod") {
        ediCostMod_cell = tblCells[k].parentNode.childNodes[l];
      }
    }
    if (
      Math.abs(
        (ediCostMod_cell.innerHTML - lastCost_cell.innerHTML) /
          ediCostMod_cell.innerHTML
      ) > 0.05
    ) {
      ediCostMod_cell.style.backgroundColor = "#ffb3ca";
    }
  }

  // for (let i = 0; i < tblCols.length; i++) {
  //   // console.log(`typeof tblCols[${i}]==> ${typeof tblCols[i]}`);
  //   // console.log(`tblCols[${i}]==> ${tblCols[i]}`);
  //   for (let j = 0; j < tblCells.length; j++) {
  //     if (tblCols[i] === "lastCost") {
  //       lastCost_cell = tblCells[j].parentNode.childNodes[i];
  //     }
  //     if (tblCols[i] === "ediCostMod") {
  //       ediCostMod_cell = tblCells[j].parentNode.childNodes[i];
  //     }
  //     if (
  //       Math.abs(
  //         (ediCostMod_cell.innerHTML - lastCost_cell.innerHTML) /
  //           ediCostMod_cell.innerHTML
  //       ) > 0.05
  //     ) {
  //       ediCostMod_cell.style.backgroundColor = "#ffb3ca";
  //     }
  //   }
  // }
  // console.log(`ri_t0d_test==> ${ri_t0d_test}`);
  // console.log(`ri_t0d_test.innerHTML==> ${ri_t0d_test.innerHTML}`);
}
</script>

<style>
table {
  table-layout: fixed;
}
th {
  position: sticky;
  top: 0; /* Don't forget this, required for the stickiness */
}
</style>

<body>
  <table>
    <thead>
      <tr>
        <!--v-- NOTE: you must use the $ to access the tableData store -->
        {#each Object.keys($tableData[0]) as columnHeading}
          <th>{columnHeading}</th>
        {/each}
      </tr>
    </thead>
    <tbody id="rsltTblBdy">
      {#each Object.values($tableData) as row}
        <tr>
          {#each Object.values(row) as cell}
            <td>{cell}</td>
          {/each}
        </tr>
      {/each}
      {#if Object.keys($tableData[0]).length > 0}
        {tableHighlight()}
      {/if}
    </tbody>
  </table>
</body>
