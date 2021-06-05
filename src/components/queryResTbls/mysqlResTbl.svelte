<script>
  import tableData from "../../stores/dynamicTables/tableData1";
  import { onMount, onDestroy, beforeUpdate, afterUpdate } from "svelte";
  import { calcResTblHilite } from "../../libT0d/calcResults/tableHighlight/calcResTblHilite";

  //The beforeUpdate function schedules work to happen immediately before the DOM is updated.
  //afterUpdate is its counterpart, used for running code once the DOM is in sync with your data.
  // afterUpdate(() => {
  //   //only call tableHighlight after DOM in in sync with table data
  //   calcResTblHilite($tableData);
  // });
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
    </tbody>
  </table>
  {afterUpdate(() => {
    calcResTblHilite($tableData);
  })}
</body>
