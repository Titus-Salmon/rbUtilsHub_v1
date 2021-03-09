<script>
import tableData from "../../stores/dynamicTables/tableData1";

function tableHighlight() {
  const rsltTblBdy = document.getElementById("rsltTblBdy");
  const tblCells = rsltTblBdy.getElementsByTagName("td"); //targets all cells in table

  let tblCols = Object.keys($tableData[0]);

  let lastCost_cell;
  let ediCostMod_cell;
  let basePrice_cell;
  let charm_cell;

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
      if (
        Math.abs(
          (ediCostMod_cell.innerHTML - lastCost_cell.innerHTML) /
            ediCostMod_cell.innerHTML
        ) > 0.35
      ) {
        ediCostMod_cell.style.backgroundColor = "#ffb3ca";
        ediCostMod_cell.style.color = "black";
      }
      if (
        Math.abs(
          (ediCostMod_cell.innerHTML - lastCost_cell.innerHTML) /
            ediCostMod_cell.innerHTML
        ) > 0.05
      ) {
        ediCostMod_cell.style.backgroundColor = "#ff8533";
        ediCostMod_cell.style.color = "black";
      }
    }

    if (charm_cell && basePrice_cell) {
      //only do calcs on these cells if they exist (because sometimes your table results
      //won't include such cells/columns), otherwise you'll throw an error
      if (
        Math.abs(
          (charm_cell.innerHTML - basePrice_cell.innerHTML) /
            charm_cell.innerHTML
        ) > 0.35
      ) {
        charm_cell.style.backgroundColor = "#ffdb4b";
        charm_cell.style.color = "black";
      }
      if (
        Math.abs(
          (charm_cell.innerHTML - basePrice_cell.innerHTML) /
            charm_cell.innerHTML
        ) > 0.05
      ) {
        charm_cell.style.backgroundColor = "#ff0000";
        charm_cell.style.color = "black";
      }
    }
  }
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
      <!-- {#if Object.keys($tableData[0]).length > 0}
        {tableHighlight()}
      {/if} -->
      {#if $tableData.length !== undefined}
        {console.log(`tableData.length==> ${tableData.length}`)}
        {console.log(
          `JSON.stringify(tableData)==> ${JSON.stringify(tableData)}`
        )}
        {tableHighlight()}
      {/if}
    </tbody>
  </table>
</body>
