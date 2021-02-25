<script>
import utilResponses from "../../stores/utilResponses/st_utilResponses";

let tablesToDelete;
let delTablesResponse;

function deleteRbTable() {
  fetch("server_routes/rt_MySQL/deleteRbTable", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tablesToDelete: tablesToDelete.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      delTablesResponse = data;
      utilResponses.set([{ utilResponse: delTablesResponse }]);
      // utilResponses.update((currentData) => {
      //   currentData = [
      //     {
      //       utilResponse: Object.values(delTablesResponse),
      //     },
      //   ];
      //   return currentData;
      // });
    });
}
</script>

<div style="padding: 0 1rem">
  <div style="text-align:center;">
    <label for="tablesToDelete">Tables To Delete (csv)</label>
  </div>
  <div style="text-align:center">
    <input
      type="text"
      id="tablesToDelete"
      name="tablesToDelete"
      bind:this="{tablesToDelete}" />
  </div>
  <div style="text-align:center">
    <button on:click="{deleteRbTable}">deleteRbTables</button>
  </div>
</div>
