<script>
// import successkid from "images/successkid.jpg";
import DkMdBtn from "../components/DkMdBtn.svelte"; //t0d
</script>

<style>
h1,
figure,
p {
  text-align: center;
  margin: 0 auto;
}

h1 {
  font-size: 2.8em;
  text-transform: uppercase;
  font-weight: 700;
  margin: 0 0 0.5em 0;
}

figure {
  margin: 0 0 1em 0;
}

img {
  width: 100%;
  max-width: 400px;
  margin: 0 0 1em 0;
}

p {
  margin: 1em auto;
}

@media (min-width: 480px) {
  h1 {
    font-size: 4em;
  }
}
</style>

<svelte:head>
  <title>rbUtilsHub_v1</title>
</svelte:head>

<DkMdBtn>MODE</DkMdBtn>

<h1>rbUtilsHub_v1</h1>

<!-- <figure>
  <img alt="Success Kid" src="{successkid}" />
  <figcaption>Have fun with Sapper!</figcaption>
</figure> -->

<p>
  <strong
    >put something here for home page, possible login, or something else</strong>
</p>
