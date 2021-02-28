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
  <div class="flexbox">
    <div>
      <!--v-- staged margins ------------------------------------------------------------------------------------->
      {#if $stagingData[0].stagingDataResponse.stagedMargins}
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

    <div>
      <!--v-- staged charms - grocery ------------------------------------------------------------------------------------->
      {#if $stagingData[0].stagingDataResponse.charmProfiles.grocery}
        <div style="text-align:center">
          <p>Grocery Charm Profile</p>
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
      {/if}
      <!--^-- staged charms  - grocery------------------------------------------------------------------------------------->
    </div>
  </div>

  <div style="text-align:center">
    <button on:click="{calcResults}">calcResults</button>
  </div>
{/if}
