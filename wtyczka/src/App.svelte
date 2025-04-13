<script lang="ts">
  import "./app.css";
  import * as Tabs from "./lib/components/ui/tabs/index.js";
  import * as Card from "./lib/components/ui/card/index.js";
  import { Button } from "./lib/components/ui/button/index.js";
  import { Input } from "./lib/components/ui/input/index.js";
  import { Label } from "./lib/components/ui/label/index.js";
  import Minilogo from "./lib/icons/minilogo.svelte";

  let preferences = $state<string[]>([]);

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

  console.log(preferences);
</script>

<main>
  <div class="flex items-center relative w-full gap-2 border-b-2 pb-4">
    <div class="w-[48px]">
      <Minilogo />
    </div>

    <h3 class="flex text-2xl flex-grow">
      <span>Summa</span>
      <strong>Rizz</strong>
      <span>e</span>
    </h3>

    <Button onclick={closeWidget} variant="ghost">x</Button>
  </div>

  <div class="flex-grow w-full">
    <Tabs.Root value="feed" class="w-full h-full flex flex-col">
      <Tabs.List class="grid w-full grid-cols-2">
        <Tabs.Trigger value="feed">Personalized feed</Tabs.Trigger>
        <Tabs.Trigger value="password">Summary</Tabs.Trigger>
      </Tabs.List>
      <!--  -->
      <!-- TAB 1 -->
      <!--  -->
      <Tabs.Content value="feed" class="h-full">
        <Card.Root class="h-full flex flex-col">
          <Card.Header>
            <Card.Title>Personalized feed</Card.Title>
            <Card.Description>
              Provide a few keywords to personalize your feed. Everything else
              will be blured.
            </Card.Description>
          </Card.Header>
          <Card.Content class="space-y-2 flex-grow gap-2">
            <div class="flex gap-2">
              <Input
                id="name"
                value="Pedro Duarte"
                placeholder="Enter a keyword"
              />

              <Button
                class="p-2"
                onclick={() => {
                  const input = document.getElementById(
                    "name"
                  ) as HTMLInputElement;
                  if (input.value) {
                    preferences = [...preferences, input.value];
                    input.value = "";
                  }
                }}
              >
                <span class="text-sm">Add</span></Button
              >
            </div>

            <div class="flex-wrap gap-2 flex pt-4">
              {#if preferences.length === 0}
                <span class="text-sm text-gray-500">
                  No keywords added yet.
                </span>
              {:else}
                {#each preferences as preference}
                  <div class="bg-gray-200 rounded-full px-2 text-sm">
                    <span>
                      {preference}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      class="ml-2"
                      on:click={() => {
                        preferences = preferences.filter(
                          (p) => p !== preference
                        );
                      }}
                    >
                      x
                    </Button>
                  </div>
                {/each}
              {/if}
            </div>
          </Card.Content>

          <Card.Footer>
            <Button>Save Personalized</Button>
          </Card.Footer>
        </Card.Root>
      </Tabs.Content>
      <!--  -->
      <!-- TAB 1 -->
      <!--  -->
      <Tabs.Content value="password" class="h-full">
        <Card.Root class="h-full flex flex-col">
          <Card.Header>
            <Card.Title>Password</Card.Title>
            <Card.Description>
              Change your password here. After saving, you'll be logged out.
            </Card.Description>
          </Card.Header>
          <Card.Content class="space-y-2 flex-grow">
            <div class="space-y-1">
              <Label for="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div class="space-y-1">
              <Label for="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </Card.Content>
          <Card.Footer>
            <Button>Save password</Button>
          </Card.Footer>
        </Card.Root>
      </Tabs.Content>
    </Tabs.Root>
  </div>
</main>
