<script>
import utilResponses from "../stores/utilResponses/st_utilResponses";
import calcResStore from "../stores/calcResults/st_calcResults";
let save_imw_CSVfileName;
let save_imw_CSVresponse;
function save_imw_CSV() {
  fetch("server_routes/rt_MySQL/save_imw_CSV", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: save_imw_CSVfileName.value,
    }),
  })
    .then((save_imw_CSVresult) => save_imw_CSVresult.json())
    .then((save_imw_CSVresultJSON) => {
      console.log(
        `JSON.stringify(save_imw_CSVresultJSON)==> ${JSON.stringify(
          save_imw_CSVresultJSON
        )}`
      );
      save_imw_CSVresponse = save_imw_CSVresultJSON;

      calcResStore.set([{ calcResStoreData: save_imw_CSVresponse }]);

      // utilResponses.update((currentData) => {
      //   currentData = [
      //     {
      //       utilResponse: Object.values(save_imw_CSVresponse),
      //     },
      //   ];
      //   return currentData;
      // });
    });
}
</script>

<div>
  <div style="text-align:center">
    <label for="save_imw_CSV">File Name</label>
  </div>
  <div style="text-align:center">
    <input
      type="text"
      id="save_imw_CSV"
      name="save_imw_CSV"
      bind:this="{save_imw_CSVfileName}" />
  </div>
  <div style="text-align:center">
    <button on:click="{save_imw_CSV}">save_imw_CSV</button>
  </div>
</div>
