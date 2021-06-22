<script>
  import { onMount, onDestroy } from "svelte";
  import imwClickerResTblData from "../../../stores/dynamicTables/st_imwClickerResTbl";
  import ImwClickerRsltsTbl from "../../../components/imwClickerRsltsTables/imwClickerRsltsTbl.svelte";
  import PaginUI from "../../../components/UI/paginUI.svelte";
  import paginData from "../../../stores/pagination/st_pagination1";
  import utilResponses from "../../../stores/utilResponses/st_utilResponses";
  import SaveToXLSX from "../../../libT0d/saveToXLSX.svelte";

  let ediTableName;
  let venCatPrefix;

  function upcsNotInCatapult() {
    fetch("server_routes/rt_imwClicker/imwClicker", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ediTableName: ediTableName.value,
        venCatPrefix: venCatPrefix.value,
      }),
    })
      .then((queryRes) => queryRes.json())
      .then((queryResJSON) => {
        imwClickerResTblData.set(queryResJSON.queryResArr);
        console.log(
          `JSON.stringify(queryResJSON.queryResArr)==> ${JSON.stringify(
            queryResJSON.queryResArr
          )}`
        ); //passing backend response to frontend "Store" & we are overwriting the "Store" with set()
        paginData.update((currentData) => {
          currentData = [
            {
              totalPages: queryResJSON.totalPages,
              currentPage: queryResJSON.currentPage,
              nextPage: queryResJSON.nextPage,
              prevPage: queryResJSON.prevPage,
            },
          ];
          return currentData;
        });
      });
    //^//[3] then, the results from the 1st then() are passed as "queryResJSON",
    //and at that point we can use this JSON object to do whatever with, such as stringify it, or
    //display it in a table on the frontend
  }
  onDestroy(() => {
    //empty pagin and table stores when navigating away from imwClicker, so pagin and tables don't linger
    paginData.set([
      {
        totalPages: null,
        currentPage: null,
      },
    ]);

    imwClickerResTblData.set([{}]);
  });
</script>

<div class="flexbox">
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

<!-- //////////////button//////////////////////////// -->
<div style="text-align:center">
  <button on:click="{upcsNotInCatapult}">upcsNotInCatapult</button>
</div>

<!-- /////////// -->

{#if $utilResponses[0]["utilResponse"] !== null}
  {#if $utilResponses[0]["utilResponse"]["response from imwClicker"]}
    <div style="text-align:center;">
      <p style="color: var(--element6)">
        {JSON.stringify(
          $utilResponses[0]["utilResponse"]["response from imwClicker"]
        )}
      </p>
    </div>
  {/if}
{/if}

{#if Object.keys($imwClickerResTblData[0]).length > 0}
  <SaveToXLSX />
  {#if $paginData[0].totalPages !== null}
    <p style="text-align:center; margin: 0">
      Page {$paginData[0].currentPage} of {$paginData[0].totalPages}
    </p>
    <PaginUI />
  {/if}
  <ImwClickerRsltsTbl />
{/if}
