<script>
import paginData from "../../stores/pagination/pagination1.js";
let pagin_data;
paginData.subscribe((paginData_t0d) => (pagin_data = paginData_t0d));
</script>

<style>
</style>

<body>
  {#if pagin_data[0] !== undefined}
    <p>Object.keys(pagin_data)==> {Object.keys(pagin_data)}</p>
    <p>pagin_data[0]==> {pagin_data[0]}</p>
  {/if}
</body>
