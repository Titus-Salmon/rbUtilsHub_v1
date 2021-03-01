<script>
import stagingData from "../../stores/stagingData/st_stagingData.js";
import calcResStore from "../../stores/calcResults/st_calcResults";

import paginData from "../../stores/pagination/st_pagination1";
import calcResTableData from "../../stores/dynamicTables/st_calcResTable";

import PaginUI from "../../components/UI/paginUI.svelte";
import CalcResTable from "../../components/queryResTbls/calcResTable.svelte";

let tableName = $stagingData[0].stagingDataResponse.stagedTableName;
let calcResultsResponse;
let imwOptions;
let skuMismatchAllowance;
let dptFilter;
let edlpSwitch;
let skuToggle;
let skuMismatchOption;

function calcResults() {
  fetch("server_routes/rt_MySQL/calcResults", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tableName: tableName,
    }),
  })
    .then((calcResultsResult) => calcResultsResult.json())
    .then((calcResultsResultJSON) => {
      console.log(
        `JSON.stringify(calcResultsResultJSON)==> ${JSON.stringify(
          calcResultsResultJSON
        )}`
      );

      calcResTableData.set(calcResultsResultJSON.queryResArr_1stPage);

      calcResultsResponse = calcResultsResultJSON;

      calcResStore.set([{ calcResStoreData: calcResultsResponse }]);

      paginData.update((currentData) => {
        currentData = [
          {
            totalPages: calcResultsResultJSON.totalPages,
            currentPage: calcResultsResultJSON.currentPage,
            nextPage: calcResultsResultJSON.nextPage,
            prevPage: calcResultsResultJSON.prevPage,
          },
        ];
        return currentData;
      });

      // stagingData.update((currentData) => {
      //   currentData = [
      //     {
      //       stagingDataResponse: Object.values(calcResultsResponse),
      //     },
      //   ];
      //   return currentData;
      // });
    });
}
</script>

{#if $stagingData[0].stagingDataResponse !== null}
  <div class="flexbox" style="align-items: flex-start">
    <div style="padding: 0 1rem">
      <!--v-- staged margins ------------------------------------------------------------------------------------->
      {#if $stagingData[0].stagingDataResponse.stagedMargins}
        <div style="text-align:center">
          <p>Staged Margins</p>
        </div>
        {#each Object.values($stagingData[0].stagingDataResponse.stagedMargins) as stagedMargin}
          <div style="text-align:center;">
            <label for="{stagedMargin.dptName}">{stagedMargin.dptName}</label>
          </div>
          {#if stagedMargin.nonDefaultMargin}
            <div style="text-align:center">
              <input
                style="background-color: #ff6666; color: black"
                type="text"
                id="{stagedMargin.dptName}"
                name="{stagedMargin.dptName}"
                bind:value="{stagedMargin.margin}" />
            </div>
          {:else}
            <div style="text-align:center">
              <input
                type="text"
                id="{stagedMargin.dptName}"
                name="{stagedMargin.dptName}"
                bind:value="{stagedMargin.margin}" />
            </div>
          {/if}
        {/each}
      {/if}
      <!--^-- staged margins ------------------------------------------------------------------------------------->
    </div>
    <!---------------------------------------------------------------------------------------------------------------------------------->
    <div style="padding: 0 1rem">
      <!--v-- staged charms - grocery------------------------------------------------------------------------------------->
      <!--v-- staged charms - grocery lower cutoffs ------------------------------------------------------------------------------------->

      {#if $stagingData[0].stagingDataResponse.charmProfiles.grocery}
        <div style="text-align:center">
          <p>Grocery Charm Profile - Lower Cutoffs</p>
        </div>
        <div style="text-align:center;">
          <label
            for="{$stagingData[0].stagingDataResponse.charmProfiles.grocery
              .lowerCutoffRqdRtl.name}"
            >{$stagingData[0].stagingDataResponse.charmProfiles.grocery
              .lowerCutoffRqdRtl.name}</label>
        </div>
        <div style="text-align:center">
          <input
            type="text"
            id="{$stagingData[0].stagingDataResponse.charmProfiles.grocery
              .lowerCutoffRqdRtl.name}"
            name="{$stagingData[0].stagingDataResponse.charmProfiles.grocery
              .lowerCutoffRqdRtl.name}"
            bind:value="{$stagingData[0].stagingDataResponse.charmProfiles
              .grocery.lowerCutoffRqdRtl.dollars}" />
        </div>
        {#each $stagingData[0].stagingDataResponse.charmProfiles.grocery.lowercutoffCharms as lowercutoffCharmGroc}
          <div style="text-align:center;">
            <label for="{lowercutoffCharmGroc.charmName}"
              >{lowercutoffCharmGroc.charmName}</label>
          </div>
          <div style="text-align:center">
            <input
              type="text"
              id="{lowercutoffCharmGroc.charmName}"
              name="{lowercutoffCharmGroc.charmName}"
              bind:value="{lowercutoffCharmGroc.cents}" />
          </div>
        {/each}

        <!--v-- staged charms - grocery defaults ------------------------------------------------------------------------------------->
        <div style="text-align:center">
          <p>Grocery Charm Profile - Defaults</p>
        </div>
        <div style="text-align:center;">
          <label
            for="{$stagingData[0].stagingDataResponse.charmProfiles.grocery
              .upperCutoffRqdRtl.name}"
            >{$stagingData[0].stagingDataResponse.charmProfiles.grocery
              .upperCutoffRqdRtl.name}</label>
        </div>
        <div style="text-align:center">
          <input
            type="text"
            id="{$stagingData[0].stagingDataResponse.charmProfiles.grocery
              .upperCutoffRqdRtl.name}"
            name="{$stagingData[0].stagingDataResponse.charmProfiles.grocery
              .upperCutoffRqdRtl.name}"
            bind:value="{$stagingData[0].stagingDataResponse.charmProfiles
              .grocery.upperCutoffRqdRtl.dollars}" />
        </div>
        {#each $stagingData[0].stagingDataResponse.charmProfiles.grocery.defaultCharms as defaultCharmGroc}
          <div style="text-align:center;">
            <label for="{defaultCharmGroc.charmName}"
              >{defaultCharmGroc.charmName}</label>
          </div>
          <div style="text-align:center">
            <input
              type="text"
              id="{defaultCharmGroc.charmName}"
              name="{defaultCharmGroc.charmName}"
              bind:value="{defaultCharmGroc.cents}" />
          </div>
        {/each}
      {/if}
      <!--^-- staged charms  - grocery------------------------------------------------------------------------------------->
    </div>
    <!---------------------------------------------------------------------------------------------------------------------------------->
    <div style="padding: 0 1rem">
      <!--v-- staged charms - wellness------------------------------------------------------------------------------------->
      <!--v-- staged charms - wellness lower cutoffs ------------------------------------------------------------------------------------->

      {#if $stagingData[0].stagingDataResponse.charmProfiles.wellness}
        <div style="text-align:center">
          <p>Wellness Charm Profile - Lower Cutoffs</p>
        </div>
        <div style="text-align:center;">
          <label
            for="{$stagingData[0].stagingDataResponse.charmProfiles.wellness
              .lowerCutoffRqdRtl.name}"
            >{$stagingData[0].stagingDataResponse.charmProfiles.wellness
              .lowerCutoffRqdRtl.name}</label>
        </div>
        <div style="text-align:center">
          <input
            type="text"
            id="{$stagingData[0].stagingDataResponse.charmProfiles.wellness
              .lowerCutoffRqdRtl.name}"
            name="{$stagingData[0].stagingDataResponse.charmProfiles.wellness
              .lowerCutoffRqdRtl.name}"
            bind:value="{$stagingData[0].stagingDataResponse.charmProfiles
              .wellness.lowerCutoffRqdRtl.dollars}" />
        </div>
        {#each $stagingData[0].stagingDataResponse.charmProfiles.wellness.lowercutoffCharms as lowercutoffCharmWell}
          <div style="text-align:center;">
            <label for="{lowercutoffCharmWell.charmName}"
              >{lowercutoffCharmWell.charmName}</label>
          </div>
          <div style="text-align:center">
            <input
              type="text"
              id="{lowercutoffCharmWell.charmName}"
              name="{lowercutoffCharmWell.charmName}"
              bind:value="{lowercutoffCharmWell.cents}" />
          </div>
        {/each}

        <!--v-- staged charms - wellness defaults ------------------------------------------------------------------------------------->
        <div style="text-align:center">
          <p>Wellness Charm Profile - Defaults</p>
        </div>
        <div style="text-align:center;">
          <label
            for="{$stagingData[0].stagingDataResponse.charmProfiles.wellness
              .upperCutoffRqdRtl.name}"
            >{$stagingData[0].stagingDataResponse.charmProfiles.wellness
              .upperCutoffRqdRtl.name}</label>
        </div>
        <div style="text-align:center">
          <input
            type="text"
            id="{$stagingData[0].stagingDataResponse.charmProfiles.wellness
              .upperCutoffRqdRtl.name}"
            name="{$stagingData[0].stagingDataResponse.charmProfiles.wellness
              .upperCutoffRqdRtl.name}"
            bind:value="{$stagingData[0].stagingDataResponse.charmProfiles
              .wellness.upperCutoffRqdRtl.dollars}" />
        </div>
        {#each $stagingData[0].stagingDataResponse.charmProfiles.wellness.defaultCharms as defaultCharmWell}
          <div style="text-align:center;">
            <label for="{defaultCharmWell.charmName}"
              >{defaultCharmWell.charmName}</label>
          </div>
          <div style="text-align:center">
            <input
              type="text"
              id="{defaultCharmWell.charmName}"
              name="{defaultCharmWell.charmName}"
              bind:value="{defaultCharmWell.cents}" />
          </div>
        {/each}
      {/if}
      <!--^-- staged charms  - wellness------------------------------------------------------------------------------------->
    </div>
    <!------------------------------------------------------------------------------------------------------------------------>
    <div style="padding: 0 1rem">
      <!-- ongoing WS discos ------------------------------------------------------------------>
      {#if $stagingData[0].stagingDataResponse}
        <div style="text-align:center">
          <p>Ongoing Discos</p>
        </div>
        <div style="text-align:center;">
          <label for="ongDisco_WS">ongDisco_WS</label>
        </div>
        <div style="text-align:center">
          <input
            type="text"
            id="ongDisco_WS"
            name="ongDisco_WS"
            bind:value="{$stagingData[0].stagingDataResponse.ongDisco_WS}" />
        </div>
        <!-- ongoing Rtl discos ------------------------------------------------------------------>
        <div style="text-align:center;">
          <label for="ongDisco_Rtl">ongDisco_Rtl</label>
        </div>
        <div style="text-align:center">
          <input
            type="text"
            id="ongDisco_Rtl"
            name="ongDisco_Rtl"
            bind:value="{$stagingData[0].stagingDataResponse.ongDisco_Rtl}" />
        </div>
        <div style="text-align:center">
          <p>Divide Cost By EA/CS</p>
        </div>
        <!-- divide cost by EA-## ------------------------------------------------------------------>
        <div style="text-align:center;">
          <label for="eaNumDivide">eaNumDivide</label>
        </div>
        <div style="text-align:center">
          <input
            type="text"
            id="eaNumDivide"
            name="eaNumDivide"
            bind:value="{$stagingData[0].stagingDataResponse.eaNumDivide}" />
        </div>
        <!-- divide cost by CS-## ------------------------------------------------------------------>
        <div style="text-align:center;">
          <label for="csNumDivide">csNumDivide</label>
        </div>
        <div style="text-align:center">
          <input
            type="text"
            id="csNumDivide"
            name="csNumDivide"
            bind:value="{$stagingData[0].stagingDataResponse.csNumDivide}" />
        </div>

        <!--dropdown options------------------------------------------------------------------------------------------>
        <!-- type of IMW -------------------------------------------------------------------------->
        <div style="text-align:center">
          <label for="querySelect">Type of IMW</label>
          <select name="querySelect" id="querySelect" bind:value="{imwOptions}">
            <option value="wholesale">Wholesale Update IMW</option>
            <option value="retail">Retail Update IMW</option>
            <option value="new">New Item IMW</option>
          </select>
        </div>

        <!-- SKU Mismatch Allowance -------------------------------------------------------------------------->
        <div style="text-align:center">
          <label for="querySelect">SKU Mismatch Options</label>
          <select
            name="querySelect"
            id="querySelect"
            bind:value="{skuMismatchAllowance}">
            <option value="allowMismatch">Allow SKU Mismatches</option>
            <option value="matchOnly">Require SKU Match</option>
          </select>
        </div>

        <!-- use EDI or Catapult SKU for IMW ----------------------------------------------------------------------------------------------->
        <div style="text-align:center">
          <label for="querySelect">Use EDI or Catapult SKU for IMW</label>
          <select name="querySelect" id="querySelect" bind:value="{skuToggle}">
            <option value="catapult">Catapult</option>
            <option value="edi">EDI</option>
          </select>
        </div>

        <!-- Flag SKU mismatch for IMW? ----------------------------------------------------------------------------------------------->
        <div style="text-align:center">
          <label for="querySelect">Flag SKU mismatch for IMW?</label>
          <select
            name="querySelect"
            id="querySelect"
            bind:value="{skuMismatchOption}">
            <option value="yes">yes</option>
            <option value="no">no</option>
          </select>
        </div>

        <!-- include EDLP ----------------------------------------------------------------------------------------------->
        <div style="text-align:center">
          <label for="querySelect">Include EDLP</label>
          <select name="querySelect" id="querySelect" bind:value="{edlpSwitch}">
            <option value="no">no</option>
            <option value="yes">yes</option>
          </select>
        </div>

        <!-- Dept Filter -------------------------------------------------------------------------->
        <div style="text-align:center">
          <label for="querySelect">Dept Filter</label>
          <select name="querySelect" id="querySelect" bind:value="{dptFilter}">
            <option value="none">none</option>
            <option value="54">Beer & Alcohol</option>
            <option value="152">Body Care</option>
            <option value="9">Books</option>
            <option value="19">Bulk</option>
            <option value="30">Bulk & Herb Prepack</option>
            <option value="175">CBD - Grocery</option>
            <option value="176">CBD - Supplements</option>
            <option value="177">CBD - Topicals</option>
            <option value="148">Consignments</option>
            <option value="150">General Merchandise</option>
            <option value="13">Gift Items</option>
            <option value="62">Grab & Go</option>
            <option value="25">Grocery</option>
            <option value="179">Grocery - Local</option>
            <option value="38">Grocery - Local Meat</option>
            <option value="12">HBA</option>
            <option value="158">Herbs & Homeopathic</option>
            <option value="80">LifeBar</option>
            <option value="151">Other</option>
            <option value="155">Refrigerated</option>
            <option value="157">Vitamins & Supplements</option>
          </select>
        </div>

        <!-- Staged Table ------------------------------------------------------------------>
        <!-- <div style="text-align:center;">
          <label for="stagedTableName">Staged Table</label>
        </div>
        <div style="text-align:center">
          <input
            type="text"
            id="stagedTableName"
            name="stagedTableName"
            bind:value="{$stagingData[0].stagingDataResponse.stagedTableName}" />
        </div> -->
      {/if}
    </div>
  </div>

  <div style="text-align:center">
    <button on:click="{calcResults}">calcResults</button>
  </div>

  {#if $calcResStore[0].calcResStoreData !== null}
    {console.log(
      `JSON.stringify($paginData[0])==> ${JSON.stringify($paginData[0])}`
    )}
    <!-- {#if $paginData[0].totalPages !== null}
      <p style="text-align:center; margin: 0">
        Page {$paginData[0].currentPage} of {$paginData[0].totalPages}
      </p>
      <PaginUI />
    {/if} -->
    <CalcResTable />
  {/if}
{/if}
