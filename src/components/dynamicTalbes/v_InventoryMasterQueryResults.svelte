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
</script>

<body>
  <table>
    <table>
      <thead>
        <tr>
          {#if tableData !== undefined && tableData !== null}
            {#each Object.keys(tableData[0]) as columnHeading}
              <th>{columnHeading}</th>
            {/each}
          {/if}
        </tr><tr></tr>
      </thead>
    </table>
  </table>
</body>
