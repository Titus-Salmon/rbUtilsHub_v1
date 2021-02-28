<script>
import stagingData from "../../stores/stagingData/st_stagingData.js";
let tableName;
let calcResultsResponse;

function calcResults() {
  fetch("server_routes/rt_MySQL/calcResults", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tableName: tableName.value,
    }),
  })
    .then((calcResultsResult) => calcResultsResult.json())
    .then((calcResultsResultJSON) => {
      console.log(
        `JSON.stringify(calcResultsResultJSON)==> ${JSON.stringify(
          calcResultsResultJSON
        )}`
      );
      calcResultsResponse = calcResultsResultJSON;

      stagingData.set([{ stagingDataResponse: calcResultsResponse }]);

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
    <div>
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
      {/if}
    </div>
  </div>

  <div style="text-align:center">
    <button on:click="{calcResults}">calcResults</button>
  </div>
{/if}
