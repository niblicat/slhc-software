<script lang="ts">
  import { signIn, signOut } from "@auth/sveltekit/client"
  import { page } from "$app/stores"

  console.log($page.data.session)

</script>

<div class="p-24">
  {#if $page.data.session}
      <h1>You are logged in</h1>
  {:else}
      <h1>You are not logged in</h1>
      <button on:click={() => signIn("google")} class="bg-blue-500 py-1 px-2 rounded text-white font-bold">
        <img
            src="https://authjs.dev/img/providers/google.svg"
            alt="Google Logo"
            width="20"
            height="20"
         />
        Sign In
      </button>
  {/if}
</div>
