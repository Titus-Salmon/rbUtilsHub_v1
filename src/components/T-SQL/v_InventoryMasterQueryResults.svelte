<script>
import tableData from "../../stores/dynamicTables/tableData1.js";
export let table_data;
tableData.subscribe((tableData_t0d) => (table_data = tableData_t0d));
console.log(
  `table_data[0] from v_InventoryMasterQueryResults.svelte==> ${table_data[0]}`
); //this starts off as an empty object, because the tableData1.js store also starts off empty
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
  <table style="max-width:1333px">
    <thead>
      <tr>
        <!-- {#if table_data !== undefined && table_data !== null && table_data !== ""} -->
        {#each Object.keys(table_data[0]) as columnHeading}
          {#if columnHeading == "invName" || columnHeading == "invRecepitAlias" || columnHeading == "invMemo" || columnHeading == "pi1Description" || columnHeading == "pi2Description" || columnHeading == "invPowerField1"}
            <th class="widen-column">{columnHeading}</th>
          {:else}
            <th>{columnHeading}</th>
          {/if}
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
