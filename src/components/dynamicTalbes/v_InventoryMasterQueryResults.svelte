<script>
// let tableData = [];
import tableData from "../dynamicTalbes/tableStores/tableData1.js";
console.log(
  `tableData from v_InventoryMasterQueryResults.svelte==> ${tableData}`
);
console.log(
  `JSON.stringify(tableData) from v_InventoryMasterQueryResults.svelte==> ${JSON.stringify(
    tableData
  )}`
);
if (Object.keys(tableData) !== undefined && Object.keys(tableData) !== null) {
  console.log(
    `Object.keys(tableData[0][0]) from v_InventoryMasterQueryResults.svelte==> ${Object.keys(
      tableData[0][0]
    )}`
  );
}
</script>

<body>
  <table>
    <table>
      <thead>
        <tr>
          {#if Object.keys(tableData[0]) !== undefined && Object.keys(tableData[0]) !== null}
            {#each Object.keys(tableData[0][0]) as columnHeading}
              <th>{columnHeading}</th>
            {/each}
          {/if}
        </tr><tr></tr>
      </thead>
    </table>
  </table>
</body>
