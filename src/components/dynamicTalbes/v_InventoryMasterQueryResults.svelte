<script>
// let tableData = [];
import tableData from "../dynamicTalbes/tableStores/tableData1.js";
let table_data;
tableData.subscribe((tableData_t0d) => (table_data = tableData_t0d));
console.log(`table_data==> ${table_data}`);
</script>

<style>
table {
  table-layout: fixed;
}
th {
  position: sticky;
  top: 0; /* Don't forget this, required for the stickiness */
  /* background: black;
  color: #cc8500; */
}
/* tr:nth-child(even) { */
/* not quite black to alternate with pure black */
/* background-color: #1e1e2f; */
/* not quite black to alternate with pure black */
/* } */
</style>

<!-- <body class="dark-mode"> -->
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
<!-- </body> -->
