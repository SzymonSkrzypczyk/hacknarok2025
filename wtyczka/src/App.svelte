<script lang="ts">
  import svelteLogo from "./assets/svelte.svg";
  import viteLogo from "/vite.svg";
  import Counter from "./lib/Counter.svelte";

  let isSetup = $state(false);
  let payload = $state("");
  let _fetchNodes = $state<() => Node[]>(() => []);

  window.addEventListener("message", (event) => {
    console.log(event.data.payload);

    if (event.type === "INITIALIZE") {
      isSetup = true;
      _fetchNodes = event.data.fetchNodes;
    }
  });

  function handleFetchNodes() {
    const nodes = _fetchNodes();
    payload = JSON.stringify(nodes, null, 2);
  }

  console.log("App loaded");
</script>

<main>
  {#if isSetup}
    <h1>Wtyczka zaladowana :fire:</h1>
    <div class="card">
      <button onclick={handleFetchNodes}>Fetch Nodes</button>
      <p>{payload}</p>
    </div>
  {:else}
    <h1>Loading...</h1>
  {/if}
</main>
