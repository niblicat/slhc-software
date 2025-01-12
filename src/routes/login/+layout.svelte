<script lang="ts">
	import { page } from '$app/stores';
	import { signOut } from "@auth/sveltekit/client";
	
	// Reactive session store from SvelteKit, page provides session details if the user is logged in.
	let session = $page.data.session;
  
	// Optional function to handle sign out
	function handleSignOut() {
	  signOut(); // Logs the user out
	}
  </script>
  
  <nav>
	<ul>
	  <li><a href="/">Home</a></li>
	  {#if session} <!-- If a session exists, show user-specific links -->
		<li><a href="/profile">Profile</a></li>
		<li><button on:click={handleSignOut}>Sign Out</button></li>
	  {:else} <!-- If no session, show signin links -->
		<li><a href="/signin">Sign In</a></li>
	  {/if}
	</ul>
  </nav>
  
  <!-- Ensure that each route/page has a place to render -->
  <main>
	<slot />
  </main>
  
  <footer>
	<p>© 2025 My SvelteKit App</p>
  </footer>
  
  <style>
	nav ul {
	  display: flex;
	  gap: 10px;
	  list-style-type: none;
	}
  
	nav ul li {
	  display: inline;
	}
  
	main {
	  padding: 1em;
	}
  
	footer {
	  margin-top: 2em;
	  text-align: center;
	  padding: 1em;
	  background-color: #f1f1f1;
	}
  </style>
  