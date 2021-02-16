<script>
import tableData from "../../stores/dynamicTables/tableData1.js";
let table_data;
tableData.subscribe((tableData_t0d) => (table_data = tableData_t0d));

import paginData from "../../stores/pagination/pagination1.js";
let pagin_data;
paginData.subscribe((paginData_t0d) => (pagin_data = paginData_t0d));
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
  <p>Total Pages1: {Object.values(pagin_data[0])}</p>
  <!-- <p>Total Pages2: {$pagin_data[0].totalPages}</p>
  <p>Total Pages3: {$pagin_data.totalPages}</p> -->
  <table>
    <thead>
      <tr>
        {#each Object.keys(table_data[0]) as columnHeading}
          <th>{columnHeading}</th>
        {/each}
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
