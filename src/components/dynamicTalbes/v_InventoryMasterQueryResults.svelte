<script>
import tableData from "../dynamicTalbes/tableStores/tableData1.js";
let table_data;
tableData.subscribe((tableData_t0d) => (table_data = tableData_t0d));
console.log(
  `table_data[0] from v_InventoryMasterQueryResults.svelte==> ${table_data[0]}`
);
console.log(
  `JSON.stringify(table_data[0]) from v_InventoryMasterQueryResults.svelte==> ${JSON.stringify(
    table_data[0]
  )}`
);
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

<!-- see if adding body tag solves the gray windowpane problem with color toggle -->
<body>
  <table>
    <thead>
      <tr>
        <!-- {#if table_data !== undefined && table_data !== null && table_data !== ""} -->
        {#each Object.keys(table_data[0]) as columnHeading}
          <th>{columnHeading}</th>
        {/each}
        <!-- {/if} -->
      </tr>
    </thead>
    <tbody>
      {#each Object.values(table_data) as row}
        <tr>
          {#each Object.values(row) as cell}
            <td>{cell}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</body>
