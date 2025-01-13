<script lang="ts">
	import { page } from '$app/stores';
	import { signOut } from "@auth/sveltekit/client";
	
	// Reactive session store from SvelteKit, page provides session details if the user is logged in.
	let session = $page.data.session;
  
  </script>
  
  <nav>
	<ul>
	  <li><a href="/">Home</a></li>
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
  