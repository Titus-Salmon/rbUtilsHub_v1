<script>
function darkModeToggle() {
  var allDocElements = window.document.getElementsByTagName("*");
  for (let i = 0; i < allDocElements.length; i++) {
    allDocElements[i].classList.toggle("dark-mode");
  }
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
</style>

<button on:click="{darkModeToggle}">
  <slot />
</button>
