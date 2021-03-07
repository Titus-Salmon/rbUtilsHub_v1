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
  console.log(`tblCells.length==> ${tblCells.length}`);

  console.log(
    `JSON.stringify(tblCells[0].parentNode)==> ${JSON.stringify(
      tblCells[0].parentNode
    )}`
  );

  console.log(
    `tblCells[0].parentNode.childNodes.length==> ${tblCells[0].parentNode.childNodes.length}`
  );

  for (let i = 0; i < tblCells[0].parentNode.childNodes.length; i++) {
    console.log(
      `JSON.stringify(tblCells[0].parentNode.childNodes[${i}])==> ${JSON.stringify(
        tblCells[0].parentNode.childNodes[i]
      )}`
    );
  }

  for (let i = 0; i < tblCells.length; i++) {
    // console.log(
    //   `JSON.stringify(tblCells[${i}].parentNode.childNodes[0])==> ${JSON.stringify(
    //     tblCells[i].parentNode.childNodes[0]
    //   )}`
    // );
    // console.log(
    //   `tblCells[i].parentNode.childNodes.length==> ${tblCells[i].parentNode.childNodes.length}`
    // );
    // console.log(
    //   `tblCells[i].parentNode.childNodes[0]==> ${tblCells[i].parentNode.childNodes[0]}`
    // );
    // console.log(
    //   `tblCells[i].parentNode.childNodes[0].innerHTML==> ${tblCells[i].parentNode.childNodes[0].innerHTML}`
    // );
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
      {#if Object.keys($tableData[0]).length > 0}
        {tableHighlight()}
      {/if}
    </tbody>
  </table>
</body>
