<script>
  import imwClickerResTbl from "../../../stores/dynamicTables/st_imwClickerResTbl";
  import ImwClickerRsltsTbl from "../../../components/imwClickerRsltsTables/imwClickerRsltsTbl.svelte";
  import utilResponses from "../../../stores/utilResponses/st_utilResponses";

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
        imwClickerResTbl.set(queryResJSON.resObjArr);
        console.log(
          `JSON.stringify(queryResJSON.resObjArr)==> ${JSON.stringify(
            queryResJSON.resObjArr
          )}`
        ); //passing backend response to frontend "Store" & we are overwriting the "Store" with set()
      });
    //^//[3] then, the results from the 1st then() are passed as "queryResJSON",
    //and at that point we can use this JSON object to do whatever with, such as stringify it, or
    //display it in a table on the frontend
  }
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

{#if Object.keys($imwClickerResTbl[0]).length > 0}
  <ImwClickerRsltsTbl />
{/if}
