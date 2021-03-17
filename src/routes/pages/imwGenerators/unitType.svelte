<script>
import imwGenResTbl from "../../../stores/dynamicTables/st_imwGenResTbl";
import ImwGenRsltsTbl from "../../../components/imwGenRsltsTables/imwGenRsltsTbl.svelte";
import SaveToCSV from "../../../libT0d/saveToCSV.svelte";
import utilResponses from "../../../stores/utilResponses/st_utilResponses";
import { onMount, onDestroy, beforeUpdate, afterUpdate } from "svelte";

let nhcrtTableName;
let ediTableName;
let venCatPrefix;
let skuToggle;
let prchQtyOverride;

function generateUnitTypeIMW() {
  fetch("server_routes/rt_imwGenerators/generateUnitTypeIMW", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nhcrtTableName: nhcrtTableName.value,
      ediTableName: ediTableName.value,
      venCatPrefix: venCatPrefix.value,
      skuToggle: skuToggle.value,
      prchQtyOverride: prchQtyOverride.value,
    }),
  })
    .then((queryRes) => queryRes.json())
    //^//not certain how this works, but the best I can describe for now is as follows:
    //[1] the "queryRes" argument represents the result of the previous fetch()
    //[2] this result must then be converted to JSON via the json() method on the frontend, even though it was already sent
    //from the backend as JSON
    .then((queryResJSON) => {
      imwGenResTbl.set(queryResJSON.srsObjArr);
      console.log(
        `JSON.stringify(queryResJSON.srsObjArr)==> ${JSON.stringify(
          queryResJSON.srsObjArr
        )}`
      ); //passing backend response to frontend "Store" & we are overwriting the "Store" with set()
    });
  //^//[3] then, the results from the 1st then() are passed as "queryResJSON",
  //and at that point we can use this JSON object to do whatever with, such as stringify it, or
  //display it in a table on the frontend
}
</script>

<style>
</style>

<div class="flexbox">
  <!-- //////////////nhcrtTableName//////////////////////////// -->
  <div>
    <div style="text-align:center;">
      <label for="nhcrtTableName">NHCRT Table Name</label>
    </div>
    <div style="text-align:center">
      <input
        type="text"
        id="nhcrtTableName"
        name="nhcrtTableName"
        required
        bind:this="{nhcrtTableName}" />
    </div>
  </div>

  <!-- //////////////ediTableName//////////////////////////// -->
  <div>
    <div style="text-align:center;">
      <label for="ediTableName">EDI Table Name</label>
    </div>
    <div style="text-align:center">
      <input
        type="text"
        id="ediTableName"
        name="ediTableName"
        required
        bind:this="{ediTableName}" />
    </div>
  </div>

  <!-- //////////////vendor catalog prefix//////////////////////////// -->
  <div>
    <div style="text-align:center;">
      <label for="venCatPrefix">Vendor Catalog Prefix</label>
    </div>
    <div style="text-align:center">
      <input
        type="text"
        id="venCatPrefix"
        name="venCatPrefix"
        required
        bind:this="{venCatPrefix}" />
    </div>
  </div>

  <!-- //////////////Use EDI or Catapult SKU for IMW//////////////////////////// -->
  <div style="text-align:center">
    <label for="skuToggle">Use EDI or Catapult SKU for IMW</label>
    <select name="skuToggle" id="skuToggle" bind:value="{skuToggle}">
      <option value="edi">EDI</option>
      <option value="catapult">Catapult</option>
    </select>
  </div>

  <!-- //////////////Allow purchase qty override?//////////////////////////// -->
  <div style="text-align:center">
    <label for="prchQtyOverride">Allow purchase qty override?</label>
    <select
      name="prchQtyOverride"
      id="prchQtyOverride"
      bind:value="{prchQtyOverride}">
      <option value="yes">yes</option>
      <option value="no">no</option>
    </select>
  </div>
</div>
<!-- //////////////button//////////////////////////// -->
<div style="text-align:center">
  <button on:click="{generateUnitTypeIMW}">generateUnitTypeIMW</button>
</div>

{#if $utilResponses[0]["utilResponse"] !== null}
  {#if $utilResponses[0]["utilResponse"]["response from saveToCSV"]}
    <div style="text-align:center;">
      <p style="color: var(--element6)">
        {JSON.stringify(
          $utilResponses[0]["utilResponse"]["response from saveToCSV"]
        )}
      </p>
    </div>
  {/if}
{/if}

{#if Object.keys($imwGenResTbl[0]).length > 0}
  <SaveToCSV />
  <ImwGenRsltsTbl />
{/if}
