<script>
import utilResponses from "../stores/utilResponses/st_utilResponses";
let saveToCSVcreatePopFileName;
let saveToCSVcreatePopTableName;
let saveToCSVcreatePopResponse;

function saveToCSVcreatePop() {
  fetch("server_routes/saveToCSVcreatePop", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileNameData: saveToCSVcreatePopFileName.value,
      tableNameData: saveToCSVcreatePopTableName.value,
    }),
  })
    .then((saveToCSVcreatePopResult) => saveToCSVcreatePopResult.json())
    .then((saveToCSVcreatePopResultJSON) => {
      console.log(
        `JSON.stringify(saveToCSVcreatePopResultJSON)==> ${JSON.stringify(
          saveToCSVcreatePopResultJSON
        )}`
      );
      saveToCSVcreatePopResponse = saveToCSVcreatePopResultJSON;

      utilResponses.set([{ utilResponse: saveToCSVcreatePopResponse }]);

      // utilResponses.update((currentData) => {
      //   currentData = [
      //     {
      //       utilResponse: Object.values(saveToCSVcreatePopResponse),
      //     },
      //   ];
      //   return currentData;
      // });
    });
}
</script>

<div>
  <div style="text-align:center">
    <label for="saveToCSVcreatePopFileName">File Name</label>
  </div>
  <div style="text-align:center">
    <input
      type="text"
      id="saveToCSVcreatePopFileName"
      name="saveToCSVcreatePopFileName"
      bind:this="{saveToCSVcreatePopFileName}" />
  </div>
  <div style="text-align:center">
    <label for="saveToCSVcreatePopTableName">Table Name</label>
  </div>
  <div style="text-align:center">
    <input
      type="text"
      id="saveToCSVcreatePopTableName"
      name="saveToCSVcreatePopTableName"
      bind:this="{saveToCSVcreatePopTableName}" />
  </div>
  <div style="text-align:center">
    <button on:click="{saveToCSVcreatePop}">save2CSVcreatePop</button>
  </div>
</div>
