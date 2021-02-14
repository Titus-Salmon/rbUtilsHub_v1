<script>
function darkModeToggle() {
  if (localStorage.getItem("clickCounter") == 0) {
    //this is kind of an odd bird, because it concatenates the result after adding 1
    //to produce 01, instead of 1, but it works. Maybe something to spend some time on down the road, but the way it's currently written
    //is kind of cool.
    localStorage["clickCounter"] += 1;
  } else {
    localStorage["clickCounter"] = 0;
  }
  localStorage["clickCounter"] % 2 !== 0 //clickCount "odd" condition
    ? localStorage.setItem("colorScheme", "lightMode")
    : localStorage.setItem("colorScheme", "darkMode");

  if (localStorage["colorScheme"] == "lightMode") {
    return window.document.documentElement.setAttribute("color-mode", "light");
  }
  window.document.documentElement.setAttribute("color-mode", "dark");

  // if (localStorage["colorScheme"] == "darkMode") {
  //   window.document.documentElement.setAttribute("color-mode", "dark");
  // } else {
  //   window.document.documentElement.setAttribute("color-mode", "light");
  // }

  // var allDocNavElems = window.document.getElementsByTagName("nav");
  // for (let i = 0; i < allDocNavElems.length; i++) {
  //   allDocNavElems[i].classList.toggle("light-mode-nav");
  // }

  // var allDocMainElems = window.document.getElementsByTagName("main");
  // for (let i = 0; i < allDocMainElems.length; i++) {
  //   allDocMainElems[i].classList.toggle("light-mode-main");
  // }

  // var allDocBodyElems = window.document.getElementsByTagName("body");
  // for (let i = 0; i < allDocBodyElems.length; i++) {
  //   allDocBodyElems[i].classList.toggle("light-mode-body");
  // }

  // var allDocThElems = window.document.getElementsByTagName("th");
  // for (let i = 0; i < allDocThElems.length; i++) {
  //   allDocThElems[i].classList.toggle("light-mode-th");
  // }

  // var allDocTrElems = window.document.getElementsByTagName("tr");
  // for (let i = 0; i < allDocTrElems.length; i++) {
  //   allDocTrElems[i].classList.toggle("light-mode-tr");
  // }

  // var allDocButtonElems = window.document.getElementsByTagName("button");
  // for (let i = 0; i < allDocButtonElems.length; i++) {
  //   allDocButtonElems[i].classList.toggle("light-mode-button");
  // }

  // var allDocTextAreaElems = window.document.getElementsByTagName("textarea");
  // for (let i = 0; i < allDocTextAreaElems.length; i++) {
  //   allDocTextAreaElems[i].classList.toggle("light-mode-textarea");
  // }

  // var allDocLabelElems = window.document.getElementsByTagName("label");
  // for (let i = 0; i < allDocLabelElems.length; i++) {
  //   allDocLabelElems[i].classList.toggle("light-mode-label");
  // }

  // var allDocInputElems = window.document.getElementsByTagName("input");
  // for (let i = 0; i < allDocInputElems.length; i++) {
  //   allDocInputElems[i].classList.toggle("light-mode-input");
  // }

  // var allDocPElems = window.document.getElementsByTagName("p");
  // for (let i = 0; i < allDocPElems.length; i++) {
  //   allDocPElems[i].classList.toggle("light-mode-p");
  // }

  // var allDocAElems = window.document.getElementsByTagName("a");
  // for (let i = 0; i < allDocAElems.length; i++) {
  //   allDocAElems[i].classList.toggle("light-mode-a");
  // }
}
</script>

<style>
</style>

<button style="display:block; margin: 0 auto" on:click="{darkModeToggle}">
  <slot />
</button>
