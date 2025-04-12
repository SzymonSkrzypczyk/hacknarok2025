<script lang="ts">
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

<main>
  <button onclick={closeWidget}> Close Widget </button>
  <button onclick={handleClick}> Send Message </button>
</main>
