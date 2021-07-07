<script>
  import generalTableData from "../../stores/dynamicTables/generalTableData";
  import { onMount, onDestroy, beforeUpdate, afterUpdate } from "svelte";
  import { resetCells } from "../../libT0d/calcResults/tableHighlight/resetCells";
  import { calcResTblHilite } from "../../libT0d/calcResults/tableHighlight/calcResTblHilite";

  //The beforeUpdate function schedules work to happen immediately before the DOM is updated.
  //afterUpdate is its counterpart, used for running code once the DOM is in sync with your data.
  // afterUpdate(() => {
  //   //only call tableHighlight after DOM in in sync with table data
  //   calcResTblHilite($generalTableData);
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
        <!--v-- NOTE: you must use the $ to access the generalTableData store -->
        {#each Object.keys($generalTableData[0]) as columnHeading}
          <th>{columnHeading}</th>
        {/each}
      </tr>
    </thead>
    <tbody id="rsltTblBdy">
      {#each Object.values($generalTableData) as row}
        <tr>
          {#each Object.values(row) as cell}
            <td>{cell}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</body>
