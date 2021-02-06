<script>
let clickCount = 0;
function darkModeToggle() {
  //v//don't really need this for now, but putting color scheme designation on click into localStorage may be useful at some point
  // if (localStorage.getItem("colorScheme") !== null) {
  //   localStorage.removeItem("colorScheme");
  // }
  // clickCount += 1;
  // clickCount % 2 !== 0 //clickCount "odd" condition
  //   ? localStorage.setItem("colorScheme", "darkMode")
  //   : localStorage.setItem("colorScheme", "lightMode");
  //^//don't really need this for now, but putting color scheme designation on click into localStorage may be useful at some point

  var allDocMainElems = window.document.getElementsByTagName("main");
  for (let i = 0; i < allDocMainElems.length; i++) {
    allDocMainElems[i].classList.toggle("light-mode-main");
  }

  var allDocBodyElems = window.document.getElementsByTagName("body");
  for (let i = 0; i < allDocBodyElems.length; i++) {
    allDocBodyElems[i].classList.toggle("light-mode-body");
  }

  var allDocThElems = window.document.getElementsByTagName("th");
  for (let i = 0; i < allDocThElems.length; i++) {
    allDocThElems[i].classList.toggle("light-mode-th");
  }

  var allDocTrElems = window.document.getElementsByTagName("tr");
  for (let i = 0; i < allDocTrElems.length; i++) {
    allDocTrElems[i].classList.toggle("light-mode-tr");
  }

  var allDocButtonElems = window.document.getElementsByTagName("button");
  for (let i = 0; i < allDocButtonElems.length; i++) {
    allDocButtonElems[i].classList.toggle("light-mode-button");
  }
}
</script>

<style>
/* button {
  background-color: #f76027;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  text-transform: uppercase;
}
:global(button.dark-mode-button) {
  background-color: #0084f6;
  color: white;
} */
</style>

<button on:click="{darkModeToggle}">
  <!-- <slot /> -->
</button>
