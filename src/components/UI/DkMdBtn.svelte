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
}
</script>

<style>
</style>

<button style="display:block; margin: 1rem auto" on:click="{darkModeToggle}">
  <slot />
</button>
