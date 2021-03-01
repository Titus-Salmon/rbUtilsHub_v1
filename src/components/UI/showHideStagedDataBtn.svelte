<script>
function showHidestagedData() {
  let stagedDataModal = document.getElementById("stagedDataModal");

  if (localStorage.getItem("showHidestagedDataClickCounter") == 0) {
    //this is kind of an odd bird, because it concatenates the result after adding 1
    //to produce 01, instead of 1, but it works. Maybe something to spend some time on down the road, but the way it's currently written
    //is kind of cool.
    localStorage["showHidestagedDataClickCounter"] += 1;
  } else {
    localStorage["showHidestagedDataClickCounter"] = 0;
  }
  localStorage["showHidestagedDataClickCounter"] % 2 !== 0 //clickCount "odd" condition
    ? localStorage.setItem("showHidestagedData", "hide")
    : localStorage.setItem("showHidestagedData", "show");

  if (localStorage["showHidestagedData"] == "hide") {
    // return window.document.documentElement.setAttribute("color-mode", "light");
    return (stagedDataModal.style.display = "none");
  }
  stagedDataModal.style.display = "block";
}
</script>

<style>
</style>

<button
  style="display:block; margin: 1rem auto"
  on:click="{showHidestagedData}">
  <slot />
</button>
