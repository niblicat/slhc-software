<svelte:head>
	<link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet"/>
    <link href="https://cdn.jsdelivr.net/npm/flowbite@2.5.1/dist/flowbite.min.css" rel="stylesheet" />

</svelte:head>

<script lang="ts"  src="../path/to/flowbite/dist/flowbite.min.js">
    // export let data;

    import { page } from '$app/stores';
	import { Button } from 'flowbite-svelte';
    import CustomNavbar from './lib/CustomNavbar.svelte';
	import { redirect } from '@sveltejs/kit';

    $: activeURL = $page.url.pathname;
    $: activeURLHash = $page.url.hash;

    // sidebar state and visibility 
    let sidebarOpen = false;
    const toggleSidebar = () => {
        sidebarOpen = !sidebarOpen;
    };

    // TODO: get these from google auth
    let name = "example name";
    let email = "example email";

    function Login() {
        redirect(200, '/signin');
    }
</script>

<CustomNavbar
name={name}
email={email}
hasSidebar={false} 
sidebarOpen={sidebarOpen}
on:toggle={toggleSidebar} 
/>

<p>welcome to the home page :)</p>

<Button color="yellow" on:click={Login}>Login shortcut, don't know why this doesn't work</Button>
<a href="/signin">login (for real)</a>

