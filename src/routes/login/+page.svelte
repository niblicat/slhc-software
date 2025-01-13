<script lang="ts">
  import { signIn, signOut } from "@auth/sveltekit/client"
  import { page } from "$app/stores"

  console.log($page.data.session)

</script>

<div class="p-24">
  {#if $page.data.session}
    <h1>You are logged in</h1>
    {#if $page.data.session.user?.image}
      <img
        src={$page.data.session.user.image}
        alt="User Profile"
        class="w-12 h-12"
      />
    {/if}
    <p>Signed in as {$page.data.session.user?.name}</p>
    <button on:click={() => signOut()}>Sign Out</button>
  {:else}
    <h1>You are not logged in</h1>
    <button on:click={() => signIn("google")}>Sign In</button>
  {/if}
</div>