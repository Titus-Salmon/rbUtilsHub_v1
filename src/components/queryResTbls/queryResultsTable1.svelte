<script>
import tableData from "../../stores/dynamicTables/tableData1";

function tableHighlight() {
  console.log(
    `Object.keys($tableData[0]) from queryResultsTable1.svelte==> ${Object.keys(
      $tableData[0]
    )}`
  );
  const rsltTblBdy = document.getElementById("rsltTblBdy");
  let tblCells = rsltTblBdy.getElementsByTagName("td"); //targets all cells in table

  for (let i = 0; i < tblCells.length; i++) {
    console.log(
      "tblCells[i].parentNode.childNodes.length==>",
      tblCells[i].parentNode.childNodes.length
    );
    console.log(
      "tblCells[i].parentNode.childNodes[0].innerHTML==>",
      tblCells[i].parentNode.childNodes[0].innerHTML
    );
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
        {#if Object.keys($tableData[0]).length > 0}
          <!-- {tableHighlight()} -->
        {/if}
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
    </tbody>
  </table>
</body>
