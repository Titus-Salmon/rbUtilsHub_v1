<script>
import stagingData from "../../stores/stagingData/st_stagingData.js";
let tableName;
let loadStagingDataResponse;

function loadStagingData() {
  fetch("server_routes/rt_MySQL/loadStagingData", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tableName: tableName.value,
    }),
  })
    .then((loadStagingDataResult) => loadStagingDataResult.json())
    .then((loadStagingDataResultJSON) => {
      console.log(
        `JSON.stringify(loadStagingDataResultJSON)==> ${JSON.stringify(
          loadStagingDataResultJSON
        )}`
      );
      loadStagingDataResponse = loadStagingDataResultJSON;

      stagingData.set([{ stagingDataResponse: loadStagingDataResponse }]);

      // stagingData.update((currentData) => {
      //   currentData = [
      //     {
      //       stagingDataResponse: Object.values(loadStagingDataResponse),
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
    <label for="tableName">Table Name</label>
  </div>
  <div style="text-align:center">
    <input
      type="text"
      id="tableName"
      name="tableName"
      bind:this="{tableName}" />
  </div>
  <!-- //////////////button//////////////////////////// -->
  <div style="text-align:center">
    <button on:click="{loadStagingData}">loadStagingData</button>
  </div>
</div>
