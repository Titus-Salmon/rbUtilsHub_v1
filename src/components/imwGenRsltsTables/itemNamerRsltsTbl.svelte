<script>
import itemNamerResTbl from "../../stores/dynamicTables/st_itemNamerResTbl";
import { onMount, onDestroy, beforeUpdate, afterUpdate } from "svelte";
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
        {#each Object.keys($itemNamerResTbl[0]) as columnHeading}
          <th>{columnHeading}</th>
        {/each}
      </tr>
    </thead>
    <tbody id="rsltTblBdy">
      {#each Object.values($itemNamerResTbl) as row}
        <tr>
          {#each Object.values(row) as cell}
            <td>{cell}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</body>
