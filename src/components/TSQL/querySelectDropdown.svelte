<script>
  import VimQueryModal from "./queryModals/vimQueryModal.svelte";
  import PoQueryModal1 from "./queryModals/poQueryModal1.svelte";
  import PoAuditQueryModal1 from "./queryModals/poAuditQueryModal1.svelte";

  let selected;
</script>

<style></style>

<div style="padding-left: 6rem">
  <label for="querySelect">Select Query:</label>
  <select name="querySelect" id="querySelect" bind:value="{selected}">
    <option value="vimQuery1">vimQuery1</option>
    <option value="poQuery1">poQuery1</option>
    <option value="poAuditQuery1">poAuditQuery1</option>
  </select>
</div>

{#if selected === "vimQuery1"}
  <VimQueryModal />
{/if}
{#if selected === "poQuery1"}
  <PoQueryModal1 />
{/if}
{#if selected === "poAuditQuery1"}
  <PoAuditQueryModal1 />
{/if}
