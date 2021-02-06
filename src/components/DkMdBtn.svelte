<script>
let clickCount = 0;
function darkModeToggle() {
  console.log(
    `localStorage.getItem("colorScheme")_1==> ${localStorage.getItem(
      "colorScheme"
    )}`
  );
  if (localStorage.getItem("colorScheme") !== null) {
    localStorage.removeItem("colorScheme");
  }
  clickCount += 1;
  console.log(`clickCount % 2==> ${clickCount % 2}`);
  console.log(`typeof (clickCount % 2)==> ${typeof (clickCount % 2)}`);
  if (clickCount % 2 !== 0) {
    //if clickCount is odd
    localStorage.setItem("colorScheme", "darkMode");
  } else {
    localStorage.setItem("colorScheme", "lightMode");
  }
  console.log(
    `localStorage.getItem("colorScheme")_2==> ${localStorage.getItem(
      "colorScheme"
    )}`
  );
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
