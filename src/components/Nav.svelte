<script>
export let segment;
import DkMdBtn from "./DkMdBtn.svelte"; //t0d
</script>

<style>
nav {
  border-bottom: 1px solid rgba(255, 62, 0, 0.1);
  font-weight: 300;
  padding: 0 1em;
}
ul {
  margin: 0;
  padding: 0;
}
/* clearfix */
ul::after {
  content: "";
  display: block;
  clear: both;
}
li {
  display: block;
  float: left;
}
[aria-current] {
  position: relative;
  display: inline-block;
}
[aria-current]::after {
  position: absolute;
  content: "";
  width: calc(100% - 1em);
  height: 2px;
  background-color: rgb(255, 62, 0);
  display: block;
  bottom: -1px;
}
a {
  text-decoration: none;
  padding: 1em 0.5em;
  display: block;
}
/* t0d */
:global(body) {
  background-color: #f2eee2;
  color: #0084f6;
  transition: background-color 0.3s;
}
/* :global(main) {
  background-color: #f2eee2;
  color: #0084f6;
  transition: background-color 0.3s;
} */
:global(body.dark-mode) {
  background-color: #1d3040;
  color: #bfc2c7;
}
:global(main.dark-mode) {
  background-color: #1d3040 !important;
  color: #bfc2c7;
}
/* t0d */
</style>

<nav>
  <ul>
    <li>
      <a aria-current="{segment === undefined ? 'page' : undefined}" href="."
        >home</a>
    </li>
    <li>
      <a aria-current="{segment === 'about' ? 'page' : undefined}" href="about"
        >about</a>
    </li>

    <!-- for the blog link, we're using rel=prefetch so that Sapper prefetches
		     the blog data when we hover over the link or tap it on a touchscreen -->
    <li>
      <a
        rel="prefetch"
        aria-current="{segment === 'blog' ? 'page' : undefined}"
        href="blog">blog</a>
    </li>
  </ul>
  <!-- t0d -->
  <DkMdBtn>Mode</DkMdBtn>
  <!-- t0d -->
</nav>
