<script>
import tableData from "../../stores/dynamicTables/tableData1";
import { onMount, onDestroy, beforeUpdate, afterUpdate } from "svelte";

let lastCost_cell;
let ediCostMod_cell;
let basePrice_cell;
let charm_cell;
let cellProp;

function tableHighlight() {
  const rsltTblBdy = document.getElementById("rsltTblBdy");
  // if (rsltTblBdy === null) {
  //   return;
  // }
  let tblCells = rsltTblBdy.getElementsByTagName("td"); //targets all cells in table

  let tblCols = Object.keys($tableData[0]);

  // let lastCost_cell;
  // let ediCostMod_cell;
  // let basePrice_cell;
  // let charm_cell;

  for (let k = 0; k < tblCells.length; k++) {
    console.log(
      "tblCells[k].parentNode.childNodes[0].innerHTML==>",
      tblCells[k].parentNode.childNodes[0].innerHTML
    );
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
          (parseFloat(ediCostMod_cell.innerHTML) -
            parseFloat(lastCost_cell.innerHTML)) /
            parseFloat(ediCostMod_cell.innerHTML)
        ) > 0.35
      ) {
        ediCostMod_cell.style.backgroundColor = "#ffb3ca";
        ediCostMod_cell.style.color = "black";
      }
      if (
        Math.abs(
          (parseFloat(ediCostMod_cell.innerHTML) -
            parseFloat(lastCost_cell.innerHTML)) /
            parseFloat(ediCostMod_cell.innerHTML)
        ) > 0.5
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
          (parseFloat(charm_cell.innerHTML) -
            parseFloat(basePrice_cell.innerHTML)) /
            parseFloat(charm_cell.innerHTML)
        ) > 0.35
      ) {
        charm_cell.style.backgroundColor = "#ffdb4b";
        charm_cell.style.color = "black";
      }
      if (
        Math.abs(
          (parseFloat(charm_cell.innerHTML) -
            parseFloat(basePrice_cell.innerHTML)) /
            parseFloat(charm_cell.innerHTML)
        ) > 0.5
      ) {
        charm_cell.style.backgroundColor = "#ff0000";
        charm_cell.style.color = "black";
      }
    }
  }
}

// afterUpdate(() => {
//   //if ($tableData[0] !== undefined && $tableData[0] !== null) {
//   //if (Object.keys($tableData[0]).length > 0) {
//   tableHighlight();
//   //}
//   //}
// });
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
        <!-- {console.log(
          `JSON.stringify($tableData[0])==> ${JSON.stringify($tableData[0])}`
        )} -->
        <!-- {#if $tableData[0] !== undefined && $tableData[0] !== null} -->
        {#each Object.keys($tableData[0]) as columnHeading}
          <th>{columnHeading}</th>
        {/each}
        <!-- {/if} -->
      </tr>
    </thead>
    <tbody id="rsltTblBdy">
      <!-- {#each Object.values($tableData) as row}
        <tr>
          {#each Object.values(row) as cell}
            <td>{cell}</td>
          {/each}
        </tr>
      {/each} -->

      {#each Object.values($tableData) as row}
        <tr>
          {#if Math.abs((row["ediCostMod"] - row["lastCost"]) / row["ediCostMod"]) > 0.35}
            {#each Object.values(row) as cell}
              <td style="background-color:#ffb3ca; color: black">{cell}</td>
            {/each}
          {:else}
            {#each Object.values(row) as cell}
              <td>{cell}</td>
            {/each}
          {/if}
          <!-- {#each Object.values(row) as cell}
            <td>{cell}</td>
          {/each} -->
        </tr>
      {/each}
      <!-- if there is any data in the table store, call tableHighlight -->
      <!-- {#if Object.keys($tableData[0]).length > 0}
        {tableHighlight()}
      {/if} -->
    </tbody>
  </table>
</body>
