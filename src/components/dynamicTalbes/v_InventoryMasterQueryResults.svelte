<script>
// let tableData = [];
import tableData from "../dynamicTalbes/tableStores/tableData1.js";
let table_data;
tableData.subscribe((tableData_t0d) => (table_data = tableData_t0d));
console.log(`table_data==> ${table_data}`);

var tableRows = window.document.getElementsByTagName("tr");
// for (let i = 0; i < tableRows.length; i++) {
//   tableRows[i].classList.toggle("dark-mode-tr");
// }

let conditionalClass;
</script>

<style>
.dark-mode-tr {
  background-color: black;
  color: limegreen;
}
table {
  table-layout: fixed;
}
th {
  position: sticky;
  top: 0; /* Don't forget this, required for the stickiness */
  background: black;
  color: #cc8500;
}
th.dark-mode {
  color: #cc8500 !important;
}
tr:nth-child(even) {
  background-color: lightgray !important;
}
tr:nth-child(even).dark-mode-tr {
  /* not quite black to alternate with pure black */
  /* background-color: #1e1e2f !important; */
  background-color: white !important;
  /* not quite black to alternate with pure black */
}
/* tr:nth-child(even) { */
/* not quite black to alternate with pure black */
/* background-color: #1e1e2f; */
/* not quite black to alternate with pure black */
/* } */
</style>

<!-- <body class="dark-mode"> -->
{#if localStorage.getItem("colorScheme") === "darkMode"}
  {#each tableRows as tableRow}
    {tableRow.classList.toggle("dark-mode-tr")}
  {/each}
{:else}
  {(conditionalClass = "light-mode")}
{/if}
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
