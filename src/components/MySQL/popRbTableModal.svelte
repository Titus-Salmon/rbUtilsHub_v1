<script>
import utilResponses from "../../stores/utilResponses/st_utilResponses";
let popTableFile;
let popTableTableName;
let popTableResponse;

function popRbTable() {
  const formData = new FormData();
  const fileField = document.querySelector('input[type="file"]');
  popTableFile = fileField.files[0];
  formData.append("popTableFile", popTableFile);
  formData.append("popTableTableName", popTableTableName.value);
  console.log(`Object.keys(formData)==> ${Object.keys(formData)}`);

  fetch("server_routes/rt_MySQL/popRbTable", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      popTableResponse = data;
      utilResponses.set([{ utilResponse: popTableResponse }]);
      // utilResponses.update((currentData) => {
      //   currentData = [
      //     {
      //       utilResponse: Object.values(popTableResponse),
      //     },
      //   ];
      //   return currentData;
      // });
    });
}
</script>

<div>
  <div style="text-align:center">
    <input
      type="file"
      id="popTableFile"
      name="popTableFile"
      bind:this="{popTableFile}" />
  </div>
  <div style="text-align:center">
    <input
      type="text"
      id="popTableTableName"
      name="popTableTableName"
      bind:this="{popTableTableName}" />
  </div>
  <div style="text-align:center">
    <button on:click="{popRbTable}">popRbTable</button>
  </div>
</div>
