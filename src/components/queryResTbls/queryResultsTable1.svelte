<script>
import tableData from "../../stores/dynamicTables/tableData1";
import { onMount, onDestroy, beforeUpdate, afterUpdate } from "svelte";
import WsLogic from "./highlightLogic/wsLogic.svelte";
import RtlLogic from "./highlightLogic/rtlLogic.svelte";

let lastCost_cell;
let ediCostMod_cell;
let basePrice_cell;
let charm_cell;
let cellProp;

console.log(`JSON.stringify($tableData)==> ${JSON.stringify($tableData)}`);

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
        {#each Object.keys($tableData[0]) as columnHeading}
          <th>{columnHeading}</th>
        {/each}
      </tr>
    </thead>
    <tbody id="rsltTblBdy">
      {#if $tableData[0]["charm"] && $tableData[0]["sib_baseprice"]}
        <RtlLogic />
      {:else if $tableData[0]["ediCostMod"] && $tableData[0]["lastCost"]}
        <WsLogic />
      {:else}
        {#each Object.values($tableData) as row}
          <tr>
            {#each Object.values(row) as cell}
              <td>{cell}</td>
            {/each}
          </tr>
        {/each}
      {/if}

      <!-- {#each $tableData as row}
        <tr>
          {#if Math.abs((row["ediCostMod"] - row["lastCost"]) / row["ediCostMod"]) > 0.5}
            {#each Object.keys(row) as colName}
              {#if colName === "ediCostMod"}
                <td style="background-color:#ff8533; color: black"
                  >{row[colName]}</td>
              {:else if colName === "lastCost"}
                <td style="background-color:#ff8533; color: black"
                  >{row[colName]}</td>
              {:else}
                <td>{row[colName]}</td>
              {/if}
            {/each}
          {/if}
          {#if Math.abs((row["ediCostMod"] - row["lastCost"]) / row["ediCostMod"]) > 0.35}
            {#each Object.keys(row) as colName}
              {#if colName === "ediCostMod"}
                <td style="background-color:#ffb3ca; color: black"
                  >{row[colName]}</td>
              {:else if colName === "lastCost"}
                <td style="background-color:#ffb3ca; color: black"
                  >{row[colName]}</td>
              {:else}
                <td>{row[colName]}</td>
              {/if}
            {/each}
          {:else}
            {#each Object.values(row) as cell}
              <td>{cell}</td>
            {/each}
          {/if}
        </tr>
      {/each} -->
    </tbody>
  </table>
</body>
