<svelte:head>
    <link href="https://cdn.jsdelivr.net/npm/flowbite@2.5.1/dist/flowbite.min.css" rel="stylesheet" />
</svelte:head>

<script lang="ts">
    import type { ActionData } from './$types';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation'; // Import goto for navigation
    import { redirect } from '@sveltejs/kit';
    import CustomNavbar from './lib/CustomNavbar.svelte';
    import { Button } from 'flowbite-svelte';
    import "$lib/app.css";
    import type { PageData } from './$types';
    import { signIn, signOut } from '@auth/sveltekit/client';
	import { onMount } from 'svelte';

    console.log($page.data.session)
    console.log($page.data)
  
    // Store the current page URL and hash
    $: activeURL = $page.url.pathname;
    $: activeURLHash = $page.url.hash;

    // Sidebar state and visibility 
    let sidebarOpen = false;
    const toggleSidebar = () => {
        sidebarOpen = !sidebarOpen;
    };

    // TODO: Replace these with actual user data from Google Auth
    let name = $page.data.session?.user?.name;
    let email = $page.data.session?.user?.email;

    onMount(() => {
        // alert("Peanut butter");

        // check if we HAVE an expiry date
        if ($page.data.session?.expires) {
            const userExpire = new Date($page.data.session?.expires);
            const now = new Date();

            // check if session hasn't expired yet
            if (userExpire > now) {
                alert("Hasn't expired...");
                // Do some sort of validation check
                if ($page.data.session.access_token) {
                    const sessionID = $page.data.session.access_token;
                }
            }
        }
    });

</script>

<!-- Custom Navbar -->
<CustomNavbar
    name={name}
    email={email}
    hasSidebar={false} 
    sidebarOpen={sidebarOpen}
    on:toggle={toggleSidebar} 
/>

<!-- Main content -->
<section class="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-12">
    <div class="max-w-3xl text-center">
        <h1 class="text-4xl font-extrabold text-gray-800 mb-6">Welcome to the Speech-Language-Hearing Center's Hearing Degradation Software</h1>
        <p class="text-lg text-gray-600 mb-8">
            Access powerful features and manage everything efficiently in our easy-to-use dashboard.
        </p>

        <!-- Correct Image Reference -->
        <img src="landingpage/SIUE_logo_2024.png" alt="SIUE Logo">

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
            <button on:click={() => signOut()} class="bg-funky text-black font-bold py-2 px-8 rounded hover:bg-red-600 transition-all duration-300 mb-4">Sign Out</button>
        {:else}
            <h1>You are not logged in</h1>
            <button on:click={() => signIn("google")} class="bg-funky text-black font-bold py-2 px-8 rounded hover:bg-red-600 transition-all duration-300 mb-4">
                <img class="pr-4" loading="lazy" height="36" src="https://authjs.dev/img/providers/google.svg" alt="Google SignIn">
                <p>Sign In with Google</p>
            </button>
        {/if}
    </div>
</section>
