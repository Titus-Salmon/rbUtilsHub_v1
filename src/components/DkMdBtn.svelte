<script>
let clickCount = 0;
function darkModeToggle() {
  if (localStorage.getItem("colorScheme") !== null) {
    localStorage.removeItem("colorScheme");
  }
  clickCount += 1;
  clickCount % 2 !== 0 //clickCount "odd" condition
    ? localStorage.setItem("colorScheme", "darkMode")
    : localStorage.setItem("colorScheme", "lightMode");

  // var allDocElements = window.document.getElementsByTagName("*");
  // for (let i = 0; i < allDocElements.length; i++) {
  //   allDocElements[i].classList.toggle("dark-mode");
  // }

  var allDocThElems = window.document.getElementsByTagName("th");
  for (let i = 0; i < allDocThElems.length; i++) {
    // allDocTrElems[i].classList.remove("dark-mode");
    allDocThElems[i].classList.toggle("dark-mode-th");
  }

  var allDocTrElems = window.document.getElementsByTagName("tr");
  for (let i = 0; i < allDocTrElems.length; i++) {
    // allDocTrElems[i].classList.remove("dark-mode");
    allDocTrElems[i].classList.toggle("dark-mode-tr");
  }

  var allDocButtonElems = window.document.getElementsByTagName("button");
  for (let i = 0; i < allDocTrElems.length; i++) {
    // allDocTrElems[i].classList.remove("dark-mode");
    allDocTrElems[i].classList.toggle("dark-mode-button");
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
/* button.dark-mode-button {
  background-color: #0084f6;
  color: white;
} */
</style>

<button on:click="{darkModeToggle}">
  <slot />
</button>
