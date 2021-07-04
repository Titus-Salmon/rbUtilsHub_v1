<script>
  import imwClickerResTbl from "../../stores/dynamicTables/st_imwClickerResTbl";
  import { onMount, onDestroy, beforeUpdate, afterUpdate } from "svelte";
  import { highlight_row } from "../../libT0d/imwClicker/clickableTableFuncs";
  // import { clickableTableFuncs } from "../../libT0d/imwClicker/clickableTableFuncs";
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
        {#each Object.keys($imwClickerResTbl[0]) as columnHeading}
          <th>{columnHeading}</th>
        {/each}
      </tr>
    </thead>
    <tbody id="rsltTblBdy">
      {#each Object.values($imwClickerResTbl) as row}
        <tr>
          {#each Object.values(row) as cell}
            <td>{cell}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
    {onMount(() => {
      highlight_row();
    })}
  </table>
</body>
