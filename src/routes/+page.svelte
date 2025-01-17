<svelte:head>
    <link href="https://cdn.jsdelivr.net/npm/flowbite@2.5.1/dist/flowbite.min.css" rel="stylesheet" />
</svelte:head>

<script lang="ts">
    import type { ActionData } from './$types';
    import { page } from '$app/stores';
    import CustomNavbar from '$lib/CustomNavbar.svelte';
    import { Button } from 'flowbite-svelte';
    import { signIn, signOut } from '@auth/sveltekit/client';
	import type { UserSimple } from '$lib/MyTypes';

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

    let user: UserSimple = {
        loggedIn: !!$page.data.session?.user,
        name: $page.data.session?.user?.name || "Not logged in",
        email: $page.data.session?.user?.email || "",
        avatar: $page.data.session?.user?.image || ""
    }

</script>

<CustomNavbar
{user}
hasSidebar={false} 
sidebarOpen={sidebarOpen}
on:toggle={toggleSidebar} 
/>

<div id="content" class="h-dvh bg-gray-100 pt-16">
    <!-- Main content -->
    <section class="flex flex-col items-center justify-center py-12">
        <div class="max-w-3xl text-center">
            <h1 class="text-4xl font-extrabold text-gray-800 mb-6">Welcome to the Speech-Language-Hearing Center's Hearing Degradation Software</h1>
            <p class="text-lg text-gray-600 mb-8">
                Access powerful features and manage everything efficiently in our easy-to-use dashboard.
            </p>

            <!-- Correct Image Reference -->
            <img src="landingpage/SIUE_logo_2024.png" alt="SIUE Logo">

        </div>
    </section>
</div>
