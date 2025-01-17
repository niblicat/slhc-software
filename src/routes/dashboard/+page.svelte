<svelte:head>
	<link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet"/>
    <link href="https://cdn.jsdelivr.net/npm/flowbite@2.5.1/dist/flowbite.min.css" rel="stylesheet" />

</svelte:head>

<script lang="ts"  src="../path/to/flowbite/dist/flowbite.min.js">
    export let data;
    import { Li, List, Heading } from 'flowbite-svelte';
    import { AccordionItem, Accordion } from 'flowbite-svelte';
    import { page } from '$app/stores'; // ! page is deprecated...?
	import CustomNavbar from '$lib/CustomNavbar.svelte';
	import CustomSidebar from '$lib/CustomSidebar.svelte';
	import EmployeesPage from '$lib/EmployeesPage.svelte';
    import MailingPage from '$lib/MailingPage.svelte';
    import InsertEmployeePage from '$lib/InsertEmployeePage.svelte';
    import InsertDataPage from '$lib/InsertDataPage.svelte';
    import AdminPage from '$lib/AdminPage.svelte';
	import type { UserSimple } from '$lib/MyTypes.js';
	import Information from '$lib/Information.svelte';

    $: activeURL = $page.url.pathname;
    $: activeURLHash = $page.url.hash;

    $: admins = data.admins;
    $: employees = data.employees;

    // sidebar state and visibility 
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


<div id="content" class="min-h-screen bg-gray-100">
    <CustomNavbar
    {user}
    hasSidebar={true} 
    sidebarOpen={sidebarOpen}
    on:toggle={toggleSidebar} 
    />

    <CustomSidebar
    sidebarOpen={sidebarOpen}
    activeUrl={activeURLHash}
    on:toggle={toggleSidebar}
    />

    <!-- <p>These are for testing:</p>
    <p>activeURLHash: {activeURLHash}</p>
    <p>activeURL {activeURL}</p> -->


    {#if activeURLHash == "#employees"}
        <EmployeesPage {employees} />
    {:else if activeURLHash == "#mailings"}
        <MailingPage/>
    {:else if activeURLHash == "#admin"}
        <AdminPage {admins} />
    {:else if activeURLHash == "#insert"}
        <InsertEmployeePage/>
    {:else if activeURLHash == "#data"}
        <InsertDataPage {employees}/>
    {:else}
        <!-- User who is not logged in should be redirected to home (no hash) -->
        <div class="flex justify-center p-4 text-2xl">Welcome to the dashboard</div>
        <Information />
    {/if}
</div>