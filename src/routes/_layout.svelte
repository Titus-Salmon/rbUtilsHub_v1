<script>
import Nav from "../components/Nav.svelte";
export let segment;
</script>

<style>
main {
  position: relative;
  /* max-width: 56em; */
  /* background-color: lightgray; */
  /* padding: 2em; */
  margin: 0 auto;
  box-sizing: border-box;
}
</style>

<Nav segment="{segment}" />

<main>
  <slot />
</main>
