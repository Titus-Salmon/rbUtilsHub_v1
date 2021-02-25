<script>
import utilResponses from "../../stores/utilResponses/st_utilResponses";
let createTableTableName;
let createTableColNames;
let createTableResponse;

function createTable() {
  fetch("server_routes/rt_MySQL/createTable", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      createTableTableName: createTableTableName.value,
      createTableColNames: createTableColNames.value,
    }),
  })
    .then((createTableResult) => createTableResult.json())
    .then((createTableResultJSON) => {
      console.log(
        `JSON.stringify(createTableResultJSON)==> ${JSON.stringify(
          createTableResultJSON
        )}`
      );
      createTableResponse = createTableResultJSON;

      utilResponses.set([{ utilResponse: createTableResponse }]);

      // utilResponses.update((currentData) => {
      //   currentData = [
      //     {
      //       utilResponse: Object.values(createTableResponse),
      //     },
      //   ];
      //   return currentData;
      // });
    });
}
</script>

<div style="padding: 0 1rem">
  <!-- //////////////table name//////////////////////////// -->
  <div style="text-align:center;">
    <label for="createTableTableName">Table Name</label>
  </div>
  <div style="text-align:center">
    <input
      type="text"
      id="createTableTableName"
      name="createTableTableName"
      bind:this="{createTableTableName}" />
  </div>
  <!-- //////////////column names//////////////////////////// -->
  <div style="text-align:center">
    <label for="createTableColNames">Column Names (csv)</label>
  </div>
  <div style="text-align:center">
    <input
      type="text"
      id="createTableColNames"
      name="createTableColNames"
      bind:this="{createTableColNames}" />
  </div>
  <!-- //////////////button//////////////////////////// -->
  <div style="text-align:center">
    <button on:click="{createTable}">createTable</button>
  </div>
</div>
