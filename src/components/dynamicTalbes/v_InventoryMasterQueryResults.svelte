<script>
// let tableData = [];
import tableData from "../dynamicTalbes/tableStores/tableData1.js";
let table_data;
tableData.subscribe((tableData_t0d) => (table_data = tableData_t0d));
console.log(`table_data==> ${table_data}`);
</script>

<style>
tr:nth-child(even) {
  /* not quite black to alternate with pure black */
  background-color: #1e1e2f;
  /* not quite black to alternate with pure black */
}
th {
  position: sticky;
  top: 0; /* Don't forget this, required for the stickiness */
  background: black;
  color: orange;
}
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

<!-- <table>
  <thead>
    <tr class="red">
      <th>Name</th>
      <th>Age</th>
      <th>Job</th>
      <th>Color</th>
      <th>URL</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Lorem.</td>
      <td>Ullam.</td>
      <td>Vel.</td>
      <td>At.</td>
      <td>Quis.</td>
    </tr>
    <tr>
      <td>Quas!</td>
      <td>Velit.</td>
      <td>Quisquam?</td>
      <td>Rerum?</td>
      <td>Iusto?</td>
    </tr>
  </tbody>
</table> -->
