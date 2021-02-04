<script>
function toggle() {
  window.document.body.classList.toggle("dark-mode");
  var main_t0d = window.document.body.getElementsByTagName("main");
  main_t0d.classList.toggle("dark-mode");
}
</script>

<style>
button {
  background-color: #f76027;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  text-transform: uppercase;
}
:global(body.dark-mode) button {
  background-color: #0084f6;
  color: white;
}
:global(main.dark-mode) {
  background-color: #0084f6;
  color: white;
}
</style>

<button on:click="{toggle}">
  <slot />
</button>
