<script>
  import stagingData from "../../../stores/stagingData/st_stagingData.js";
  import calcResStore from "../../../stores/calcResults/st_calcResults";

  import paginData from "../../../stores/pagination/st_pagination1";
  import tableData from "../../../stores/dynamicTables/tableData1";

  import { Jumper } from "svelte-loading-spinners";

  let tableName = $stagingData[0].stagingDataResponse.stagedTableName;
  let venCatPrefix = $stagingData[0].stagingDataResponse.venCatPrefix;
  let calcResultsResponse;
  let lbNumDivide;
  let ozNumDivide;
  let ctNumDivide;
  let altIDqtyDiv;
  let imwOptions;
  // let skuMismatchAllowance;
  // let dptFilter;
  let includeEDLP;
  let skuToggle;
  let purchQtyOverride;
  // let skuMismatchOption;

  let inputId;
  let inputValue;

  let isLoading = false;

  function calcResults() {
    // let stagedDataModal = document.getElementById("stagedDataModal");
    isLoading = true;
    // if (!isLoading) {
    //   stagedDataModal.style.display = "none"; //hide staged data after clicking calcResults button, to reduce clutter
    //   //but only after data fro calcResults is no longer loading, so we can see the Jumper in the meantime
    // }
    // localStorage.setItem("showHidestagedData", "hide"); //set localstorage to appropriate val, so as to not hork the clickcounter
    //v//**********************************************************************************************************************/
    //can we just send stagingData.stagingDataResponse.stagedMargins to backend, because it contains all the following:
    //stagedMargins: [{dptName: vitSupp, dptNumb: '157'; margin: '50'}, ...]
    //this way, we can tap into the dpt numbers in order to apply dpt-specific margins in retailCalc function
    //YES, we can. For now, let's just hard code them into the postBodyObj, along with tableName and venCatPrefix:
    let stagedDptMargData = $stagingData[0].stagingDataResponse.stagedMargins;
    //////////////////////////////////////////////////////////////////////////////
    let postBodyObj = {
      tableName: tableName,
      venCatPrefix: venCatPrefix,
      stagedDptMargData: stagedDptMargData,
    }; //start with this, and populate it further below with all the looped

    ///here we are populating our postBodyObj with all the input values from our looped inputs below
    //(department margins, department charm profiles, ongoing discos, divide cost by ea/cs, type of imw, sku mismatch,
    //edi/catapult sku, flag sku mismatch, include edlp, dept filter)

    //v//dept margins///////////////////////////////////////////////////////////////////
    let stagedMarginValues = Object.values(
      $stagingData[0].stagingDataResponse.stagedMargins
    );
    for (let i = 0; i < stagedMarginValues.length; i++) {
      inputId = stagedMarginValues[i]["dptName"];
      inputValue = document.getElementById(`${inputId}`).value;
      postBodyObj[`${inputId}`] = inputValue;
      console.log(
        `stagedMarginValues[${i}]["dptName"]==> ${stagedMarginValues[i]["dptName"]}`
      );
    }
    //^//dept margins///////////////////////////////////////////////////////////////////

    //v//grocery department charm profiles///////////////////////////////////////////////////////////////////
    //grocery lower cutoff/////////////////////////////////
    let lowerCutoffRqdRtlGroc =
      $stagingData[0].stagingDataResponse.charmProfiles.grocery
        .lowerCutoffRqdRtl.name;
    inputId = lowerCutoffRqdRtlGroc;
    inputValue = document.getElementById(`${inputId}`).value;
    postBodyObj[`${inputId}`] = inputValue;

    let stagedlowercutoffCharmsGroc = Object.values(
      $stagingData[0].stagingDataResponse.charmProfiles.grocery
        .lowercutoffCharms
    );
    for (let i = 0; i < stagedlowercutoffCharmsGroc.length; i++) {
      inputId = stagedlowercutoffCharmsGroc[i]["charmName"];
      inputValue = document.getElementById(`${inputId}`).value;
      postBodyObj[`${inputId}`] = inputValue;
      console.log(
        `stagedlowercutoffCharmsGroc[${i}]["charmName"]==> ${stagedlowercutoffCharmsGroc[i]["charmName"]}`
      );
    }

    //grocery defaults/////////////////////////////////
    let upperCutoffRqdRtlGroc =
      $stagingData[0].stagingDataResponse.charmProfiles.grocery
        .upperCutoffRqdRtl.name;
    inputId = upperCutoffRqdRtlGroc;
    inputValue = document.getElementById(`${inputId}`).value;
    postBodyObj[`${inputId}`] = inputValue;

    let defaultCharmsGroc = Object.values(
      $stagingData[0].stagingDataResponse.charmProfiles.grocery.defaultCharms
    );
    for (let i = 0; i < defaultCharmsGroc.length; i++) {
      inputId = defaultCharmsGroc[i]["charmName"];
      inputValue = document.getElementById(`${inputId}`).value;
      postBodyObj[`${inputId}`] = inputValue;
      console.log(
        `defaultCharmsGroc[${i}]["charmName"]==> ${defaultCharmsGroc[i]["charmName"]}`
      );
    }
    //^//grocery department charm profiles///////////////////////////////////////////////////////////////////

    //v//wellness department charm profiles///////////////////////////////////////////////////////////////////
    //wellness lower cutoff/////////////////////////////////
    let lowerCutoffRqdRtlWell =
      $stagingData[0].stagingDataResponse.charmProfiles.wellness
        .lowerCutoffRqdRtl.name;
    inputId = lowerCutoffRqdRtlWell;
    inputValue = document.getElementById(`${inputId}`).value;
    postBodyObj[`${inputId}`] = inputValue;

    let stagedlowercutoffCharmsWell = Object.values(
      $stagingData[0].stagingDataResponse.charmProfiles.wellness
        .lowercutoffCharms
    );
    for (let i = 0; i < stagedlowercutoffCharmsWell.length; i++) {
      inputId = stagedlowercutoffCharmsWell[i]["charmName"];
      inputValue = document.getElementById(`${inputId}`).value;
      postBodyObj[`${inputId}`] = inputValue;
      console.log(
        `stagedlowercutoffCharmsWell[${i}]["charmName"]==> ${stagedlowercutoffCharmsWell[i]["charmName"]}`
      );
    }

    //wellness defaults/////////////////////////////////
    let upperCutoffRqdRtlWell =
      $stagingData[0].stagingDataResponse.charmProfiles.wellness
        .upperCutoffRqdRtl.name;
    inputId = upperCutoffRqdRtlWell;
    inputValue = document.getElementById(`${inputId}`).value;
    postBodyObj[`${inputId}`] = inputValue;

    let defaultCharmsWell = Object.values(
      $stagingData[0].stagingDataResponse.charmProfiles.wellness.defaultCharms
    );
    for (let i = 0; i < defaultCharmsWell.length; i++) {
      inputId = defaultCharmsWell[i]["charmName"];
      inputValue = document.getElementById(`${inputId}`).value;
      postBodyObj[`${inputId}`] = inputValue;
      console.log(
        `defaultCharmsWell[${i}]["charmName"]==> ${defaultCharmsWell[i]["charmName"]}`
      );
    }
    //^//wellness department charm profiles///////////////////////////////////////////////////////////////////

    //v//ongoing discos///////////////////////////////////////////////////////////////////////////////////////
    //ongDisco_WS
    inputId = "ongDisco_WS";
    inputValue = document.getElementById(`${inputId}`).value;
    postBodyObj[`${inputId}`] = inputValue;

    //ongDisco_Rtl
    inputId = "ongDisco_Rtl";
    inputValue = document.getElementById(`${inputId}`).value;
    postBodyObj[`${inputId}`] = inputValue;
    //^//ongoing discos///////////////////////////////////////////////////////////////////////////////////////

    //v//divide cost by ea/////////////////////////////////////////////////////////////////////////////////////
    inputId = "eaNumDivide";
    inputValue = document.getElementById(`${inputId}`).value;
    postBodyObj[`${inputId}`] = inputValue;
    //^//divide cost by ea/////////////////////////////////////////////////////////////////////////////////////

    //v//divide cost by cs/////////////////////////////////////////////////////////////////////////////////////
    inputId = "csNumDivide";
    inputValue = document.getElementById(`${inputId}`).value;
    postBodyObj[`${inputId}`] = inputValue;
    //^//divide cost by cs/////////////////////////////////////////////////////////////////////////////////////

    //v//divide cost by lb/////////////////////////////////////////////////////////////////////////////////////
    inputId = "lbNumDivide";
    inputValue = document.getElementById(`${inputId}`).value;
    postBodyObj[`${inputId}`] = inputValue;
    //^//divide cost by cs/////////////////////////////////////////////////////////////////////////////////////

    //v//divide cost by oz/////////////////////////////////////////////////////////////////////////////////////
    inputId = "ozNumDivide";
    inputValue = document.getElementById(`${inputId}`).value;
    postBodyObj[`${inputId}`] = inputValue;
    //^//divide cost by cs/////////////////////////////////////////////////////////////////////////////////////

    //v//divide cost by ct/////////////////////////////////////////////////////////////////////////////////////
    inputId = "ctNumDivide";
    inputValue = document.getElementById(`${inputId}`).value;
    postBodyObj[`${inputId}`] = inputValue;
    //^//divide cost by cs/////////////////////////////////////////////////////////////////////////////////////

    //v//divide cost by ct/////////////////////////////////////////////////////////////////////////////////////
    inputId = "altIDqtyDiv";
    inputValue = document.getElementById(`${inputId}`).value;
    postBodyObj[`${inputId}`] = inputValue;
    //^//divide cost by cs/////////////////////////////////////////////////////////////////////////////////////

    //v//typeOfIMW/////////////////////////////////////////////////////////////////////////////////////
    inputId = "typeOfIMW";
    inputValue = document.getElementById(`${inputId}`).value;
    postBodyObj[`${inputId}`] = inputValue;
    //^//typeOfIMW/////////////////////////////////////////////////////////////////////////////////////

    // //v//skuMismatchAllowance/////////////////////////////////////////////////////////////////////////////////////
    //we're allowing sku mismatches to show in our results by default, so no reason to have a dropdown for this
    // inputId = "skuMismatchAllowance";
    // inputValue = document.getElementById(`${inputId}`).value;
    // postBodyObj[`${inputId}`] = inputValue;
    // //^//skuMismatchAllowance/////////////////////////////////////////////////////////////////////////////////////

    //v//ediOrCatapultSku/////////////////////////////////////////////////////////////////////////////////////
    inputId = "ediOrCatapultSku";
    inputValue = document.getElementById(`${inputId}`).value;
    postBodyObj[`${inputId}`] = inputValue;
    //^//ediOrCatapultSku/////////////////////////////////////////////////////////////////////////////////////

    // //v//flagSkuMismatch/////////////////////////////////////////////////////////////////////////////////////
    // //we're flagging sku mismatches by default, so no reason to have a dropdown for this
    // inputId = "flagSkuMismatch";
    // inputValue = document.getElementById(`${inputId}`).value;
    // postBodyObj[`${inputId}`] = inputValue;
    // //^//flagSkuMismatch/////////////////////////////////////////////////////////////////////////////////////

    //v//includeEDLP/////////////////////////////////////////////////////////////////////////////////////
    inputId = "includeEDLP";
    inputValue = document.getElementById(`${inputId}`).value;
    postBodyObj[`${inputId}`] = inputValue;
    //^//includeEDLP/////////////////////////////////////////////////////////////////////////////////////

    //v//purchQtyOverride/////////////////////////////////////////////////////////////////////////////////////
    inputId = "purchQtyOverride";
    inputValue = document.getElementById(`${inputId}`).value;
    postBodyObj[`${inputId}`] = inputValue;
    //^//purchQtyOverride/////////////////////////////////////////////////////////////////////////////////////

    // //v//deptFilter/////////////////////////////////////////////////////////////////////////////////////
    // //we never used this option anyway, so no need to bother for now, besides, we can always select for
    // //specific dept at the query level in the 1st step of the whole process, so this is kind of a redundancy
    // inputId = "deptFilter";
    // inputValue = document.getElementById(`${inputId}`).value;
    // postBodyObj[`${inputId}`] = inputValue;
    // //^//deptFilter/////////////////////////////////////////////////////////////////////////////////////

    //^//**********************************************************************************************************************/

    console.log(
      `JSON.stringify(postBodyObj)==> ${JSON.stringify(postBodyObj)}`
    );

    // isLoading = true;

    fetch("server_routes/rt_MySQL/calcResults", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({
      //   tableName: tableName,
      // }),
      body: JSON.stringify(postBodyObj),
    })
      .then((calcResultsResult) => calcResultsResult.json())
      .then((calcResultsResultJSON) => {
        console.log(
          `JSON.stringify(calcResultsResultJSON)==> ${JSON.stringify(
            calcResultsResultJSON
          )}`
        );

        // populatedIMW.set(calcResultsResultJSON.populated_imw);
        console.log(
          `JSON.stringify(calcResultsResultJSON.populated_imw)==> ${JSON.stringify(
            calcResultsResultJSON.populated_imw
          )}`
        );

        console.log(
          `JSON.stringify(calcResultsResultJSON.populated_imw_arr)==> ${JSON.stringify(
            calcResultsResultJSON.populated_imw_arr
          )}`
        );

        // tableData.set(calcResultsResultJSON.modifiedQueryResArr);
        tableData.set(calcResultsResultJSON.modifiedQRA_1stPage);
        // tableData.set(calcResultsResultJSON.queryResArr_1stPage);

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

        if (calcResultsResultJSON.error) {
          alert(
            `err from stagedDataModal.svelte==> ${calcResultsResultJSON.error}`
          );
        }
        isLoading = false;
        let stagedDataModal = document.getElementById("stagedDataModal");
        stagedDataModal.style.display = "none"; //hide staged data after clicking calcResults button, to reduce clutter
      })
      .catch((err) => {
        alert(`err from stagedDataModal.svelte==> ${err}`);
        isLoading = false;
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
          <!-- department name   ----------------------------------------------------------->
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
          <!-- department number ------------------------------------------------------------------------>
          <!-- <div style="text-align:center;">
            <label for="{stagedMargin.dptNumb}">{stagedMargin.dptNumb}</label>
          </div>
          {#if stagedMargin.nonDefaultMargin}
            <div style="text-align:center">
              <input
                style="background-color: #ff6666; color: black"
                type="text"
                id="{stagedMargin.dptNumb}"
                name="{stagedMargin.dptNumb}"
                bind:value="{stagedMargin.dptNumb}" />
            </div>
          {:else}
            <div style="text-align:center">
              <input
                type="text"
                id="{stagedMargin.dptNumb}"
                name="{stagedMargin.dptNumb}"
                bind:value="{stagedMargin.dptNumb}" />
            </div>
          {/if} -->
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
        <!-- lbNumDivide -------------------------------------------------------------------------->
        <div style="text-align:center">
          <label for="lbNumDivide">LB-## divide</label>
          <select
            name="lbNumDivide"
            id="lbNumDivide"
            bind:value="{lbNumDivide}">
            <option value="no">no</option>
            <option value="yes">yes</option>
          </select>
        </div>
        <!-- ozNumDivide -------------------------------------------------------------------------->
        <div style="text-align:center">
          <label for="ozNumDivide">OZ-## divide</label>
          <select
            name="ozNumDivide"
            id="ozNumDivide"
            bind:value="{ozNumDivide}">
            <option value="no">no</option>
            <option value="yes">yes</option>
          </select>
        </div>
        <!-- ctNumDivide -------------------------------------------------------------------------->
        <div style="text-align:center">
          <label for="ctNumDivide">CT-## divide</label>
          <select
            name="ctNumDivide"
            id="ctNumDivide"
            bind:value="{ctNumDivide}">
            <option value="no">no</option>
            <option value="yes">yes</option>
          </select>
        </div>
        <!-- altIDqtyDiv -------------------------------------------------------------------------->
        <div style="text-align:center">
          <label for="altIDqtyDiv">altID pkgQty divide</label>
          <select
            name="altIDqtyDiv"
            id="altIDqtyDiv"
            bind:value="{altIDqtyDiv}">
            <option value="yes">yes</option>
            <option value="no">no</option>
          </select>
        </div>
        <!-- type of IMW -------------------------------------------------------------------------->
        <div style="text-align:center">
          <label for="typeOfIMW">Type of IMW</label>
          <select name="typeOfIMW" id="typeOfIMW" bind:value="{imwOptions}">
            <option value="wholesale">Wholesale Update IMW</option>
            <option value="retail">Retail Update IMW</option>
            <option value="new">New Item IMW</option>
          </select>
        </div>

        <!-- SKU Mismatch Allowance -------------------------------------------------------------------------->
        <!-- <div style="text-align:center">
          <label for="skuMismatchAllowance">SKU Mismatch Options</label>
          <select
            name="skuMismatchAllowance"
            id="skuMismatchAllowance"
            bind:value="{skuMismatchAllowance}">
            <option value="allowMismatch">Allow SKU Mismatches</option>
            <option value="matchOnly">Require SKU Match</option>
          </select>
        </div> -->

        <!-- use EDI or Catapult SKU for IMW ----------------------------------------------------------------------------------------------->
        <div style="text-align:center">
          <label for="ediOrCatapultSku">Use EDI or Catapult SKU for IMW</label>
          <select
            name="ediOrCatapultSku"
            id="ediOrCatapultSku"
            bind:value="{skuToggle}">
            <option value="catapult">Catapult</option>
            <option value="edi">EDI</option>
          </select>
        </div>

        <!-- Flag SKU mismatch for IMW? ----------------------------------------------------------------------------------------------->
        <!-- <div style="text-align:center">
          <label for="flagSkuMismatch">Flag SKU mismatch for IMW?</label>
          <select
            name="flagSkuMismatch"
            id="flagSkuMismatch"
            bind:value="{skuMismatchOption}">
            <option value="yes">yes</option>
            <option value="no">no</option>
          </select>
        </div> -->

        <!-- include EDLP ----------------------------------------------------------------------------------------------->
        <div style="text-align:center">
          <label for="includeEDLP">Include EDLP</label>
          <select
            name="includeEDLP"
            id="includeEDLP"
            bind:value="{includeEDLP}">
            <option value="no">no</option>
            <option value="yes">yes</option>
          </select>
        </div>

        <!-- Purchase Quantity Override ----------------------------------------------------------------------------------------------->
        <div style="text-align:center">
          <label for="purchQtyOverride">Purchase Quantity Override</label>
          <select
            name="purchQtyOverride"
            id="purchQtyOverride"
            bind:value="{purchQtyOverride}">
            <option value="yes">yes</option>
            <option value="no">no</option>
            <option value="doNothing">doNothing</option>
          </select>
        </div>

        <!-- Dept Filter -------------------------------------------------------------------------->
        <!-- <div style="text-align:center">
          <label for="deptFilter">Dept Filter</label>
          <select name="deptFilter" id="deptFilter" bind:value="{dptFilter}">
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
        </div> -->
      {/if}
    </div>
  </div>

  {#if isLoading}
    <div class="flexbox" margin="1rem">
      <Jumper size="60" color="#FF3E00" unit="px" duration="1s" />
    </div>
  {/if}

  <div style="text-align:center">
    <button on:click="{calcResults}">calcResults</button>
  </div>
{/if}
