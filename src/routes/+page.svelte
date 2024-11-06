<svelte:head>
    <link href="https://cdn.jsdelivr.net/npm/flowbite@2.5.1/dist/flowbite.min.css" rel="stylesheet" />
</svelte:head>

<script lang="ts">
    import type { ActionData } from './$types';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation'; // Import goto for navigation
    import CustomNavbar from './lib/CustomNavbar.svelte';
    import { Button } from 'flowbite-svelte';
    import "$lib/app.css";
    import type { PageData } from './$types';
    import { signIn, signOut } from '@auth/sveltekit/client';
  
    export let data: PageData;
    $: loggedIn = data.loggedIn;

    // Store the current page URL and hash
    $: activeURL = $page.url.pathname;
    $: activeURLHash = $page.url.hash;

    // Sidebar state and visibility 
    let sidebarOpen = false;
    const toggleSidebar = () => {
        sidebarOpen = !sidebarOpen;
    };

    // TODO: Replace these with actual user data from Google Auth
    let name = "example name";
    let email = "example email";

    // Fix the Login function using goto
    function Login() {
        goto('/signin'); // Client-side navigation to the signin page
    }
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

        {#if loggedIn}
        <div>Welcome!</div>
        <!-- <a href="/signin">Go to logged in area</a> -->
        <br />
        <br />
        <button class="bg-funky text-white font-bold py-2 px-8 rounded hover:bg-red-600 transition-all duration-300 mb-4" on:click={() => signOut()}>Log Out</button>
        {:else}
        <Button class="bg-funky text-white font-bold py-2 px-8 rounded hover:bg-red-600 transition-all duration-300 mb-4" on:click={Login}>
            <img class="pr-4" loading="lazy" height="36" src="https://authjs.dev/img/providers/google.svg" alt="Google SignIn">
            <p>Login&nbsp;with&nbsp;Google</p>
        </Button>
        {/if}

    </div>
</section>

<style>
    /* Add whatever styling you want ~ Jared */
</style>
