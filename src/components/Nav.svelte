<script>
export let segment;
// import DkMdBtn from "./DkMdBtn.svelte"; //t0d
</script>

<style>
/* nav {
  border-bottom: 1px solid rgba(255, 62, 0, 0.1);
  font-weight: 300;
  padding: 0 1em;
} */
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
</style>

<nav>
  <ul>
    <div class="flexbox">
      <div>
        <li>
          <a
            aria-current="{segment === undefined ? 'page' : undefined}"
            href=".">index</a>
        </li>
      </div>
      <div>
        <li>
          <a
            aria-current="{segment === 'tsqlHub' ? 'page' : undefined}"
            href="/pages/pg_T-SQL/tsqlHub">tsqlHub</a>
        </li>
      </div>
      <div>
        <li>
          <a
            aria-current="{segment === 'mySqlHub' ? 'page' : undefined}"
            href="/pages/pg_MySQL/mySqlHub">mySqlHub</a>
        </li>
      </div>
      <div>
        <li>
          <a
            aria-current="{segment === 'unitTypeIMW' ? 'page' : undefined}"
            href="/pages/imwGenerators/unitType">unitTypeIMW</a>
        </li>
      </div>
      <div>
        <li>
          <a
            aria-current="{segment === 'toDo' ? 'page' : undefined}"
            href="/pages/pg_toDo/toDo">toDo</a>
        </li>
      </div>
      <div>
        <li>
          <a
            aria-current="{segment === 'notes' ? 'page' : undefined}"
            href="/pages/pg_notes/notes">notes</a>
        </li>
      </div>
    </div>
  </ul>
</nav>
