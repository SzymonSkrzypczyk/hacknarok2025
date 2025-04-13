<script lang="ts">
  import "./app.css";
  import Button from "./lib/components/ui/button/button.svelte";
  window.addEventListener("message", (event) => {
    console.log(event.data.payload);
  });

  function closeWidget() {
    window.parent.postMessage(
      {
        plugin: "wtyczka",
        payload: {
          type: "close",
        },
      },
      "*"
    );
  }

  function handleClick() {
    window.parent.postMessage(
      {
        plugin: "wtyczka",
        payload: {
          type: "test",
          data: "Hello from the plugin!",
        },
      },
      "*"
    );
  }
</script>

<main class="flex flex-col items-center justify-center h-screen">
  <div class="flex gap-2">
    <Button onclick={closeWidget}>Close Widget</Button>
    <Button onclick={handleClick}>Send Message</Button>
  </div>
</main>
