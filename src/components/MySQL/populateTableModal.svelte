<script>
import utilResponses from "../../stores/utilResponses/st_utilResponses";
let popTableFile;
let popTableTableName;
let popTableResponse;

// let files;
// let statusCode = "";

// async function handleSubmit() {
//   if (files.length > 0) {
//     const formData = new FormData();
//     formData.append("file", files[0]);
//     const response = await fetch("/gateway/media_objects", {
//       method: "POST",
//       body: formData,
//     });
//     statusCode = response.status;
//   }
// }

// const formData = new FormData();
// formData.append("popTableFile_t0d", popTableFile[0]);
// formData.append("popTableFile_t0d", "popTableFile_t0d");

function test() {
  const formData = new FormData();
  const fileField = document.querySelector('input[type="file"]');
  console.log(`fileField==> ${fileField}`);
  console.log(`fileField.files==> ${fileField.files}`);
  console.log(`fileField.files[0]==> ${fileField.files[0]}`);
  popTableFile = fileField.files[0];
  formData.append("popTableFile", popTableFile);
  formData.append("popTableTableName[0]", popTableTableName[0]);
  console.log(`Object.keys(formData)==> ${Object.keys(formData)}`);

  fetch("server_routes/rt_MySQL/test", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(`data from populateTableModal.svelte==> ${data}`);
      console.log(
        `JSON.stringify(data) from populateTableModal.svelte==> ${JSON.stringify(
          data
        )}`
      );
    });
}

function popTable() {
  if (popTableFile.length > 0) {
    const formData = new FormData();
    formData.append("popTableTableName", popTableTableName);
    formData.append("popTableFile", popTableFile[0]);
    // formData.append(popTableTableName, popTableTableName);
    // formData.append(popTableFile, popTableFile);

    fetch("server_routes/rt_MySQL/popTable", {
      method: "POST",
      // headers: {
      //   "Content-Type": "application/json",
      // },
      // body: JSON.stringify({
      //   popTableFile: popTableFile.value,
      //   popTableTableName: popTableTableName.value,
      // }),
      body: formData,
    })
      .then(
        console.log(`JSON.stringify(formData)==> ${JSON.stringify(formData)}`)
      )
      .then((popTableResult) => popTableResult.json())
      .then((popTableResultJSON) => {
        console.log(
          `JSON.stringify(popTableResultJSON)==> ${JSON.stringify(
            popTableResultJSON
          )}`
        );
        popTableResponse = popTableResultJSON;

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
}
</script>

<!-- <div>
  <div style="text-align:center">
    <label for="popTableFile">File Name</label>
  </div>
  <div style="text-align:center">
    <input
      type="file"
      id="popTableFile"
      name="popTableFile"
      bind:files="{popTableFile}" />
  </div>
  <div style="text-align:center">
    <label for="popTableTableName">Table Name</label>
  </div>
  <div style="text-align:center">
    <input
      type="text"
      id="popTableTableName"
      name="popTableTableName"
      bind:this="{popTableTableName}" />
  </div>
  <div style="text-align:center">
    <button on:click="{popTable}">popTable</button>
  </div>
</div> -->

<!-- <form on:submit|preventDefault="{popTable}">
  <label for="popTableFile">File</label>
  <input required id="popTableFile" type="file" bind:files="{popTableFile}" />
  <input type="submit" value="Upload file" />
</form> -->

<!-- <form
  id="popTableForm"
  method="POST"
  action="http://localhost:3333/server_routes/rt_MySQL/popTable"
  encType="multipart/form-data"
  accept-charset="UTF-8">
  <div>
    <div style="text-align:center">
      <label for="popTableFile">File Name</label>
    </div>
    <div style="text-align:center">
      <input
        type="file"
        id="popTableFile"
        name="popTableFile"
        bind:files="{popTableFile}" />
    </div>
    <div style="text-align:center">
      <label for="popTableTableName">Table Name</label>
    </div>
    <div style="text-align:center">
      <input
        type="text"
        id="popTableTableName"
        name="popTableTableName"
        bind:this="{popTableTableName}" />
    </div>
    <div style="text-align:center">
      <button type="submit" form="popTableForm" on:click="{popTable}"
        >popTable</button>
    </div>
  </div>
</form> -->

<input
  type="file"
  id="popTableFile"
  name="popTableFile"
  bind:this="{popTableFile}" />

<input
  type="text"
  id="popTableTableName"
  name="popTableTableName"
  bind:this="{popTableTableName}" />

<button on:click="{test}">test</button>
