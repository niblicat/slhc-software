<svelte:head>
	<link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet"/>
    <link href="https://cdn.jsdelivr.net/npm/flowbite@2.5.1/dist/flowbite.min.css" rel="stylesheet" />

</svelte:head>

<script lang="ts">
    import { page } from '$app/state';
	import CustomNavbar from '$lib/CustomNavbar.svelte';
	import CustomSidebar from '$lib/CustomSidebar.svelte';
	import EmployeesPage from '$lib/EmployeesPage.svelte';
    import MailingPage from '$lib/MailingPage.svelte';
    import InsertEmployeePage from '$lib/InsertEmployeePage.svelte';
    import InsertDataPage from '$lib/InsertDataPage.svelte';
    import AdminPage from '$lib/AdminPage.svelte';
	import type { UserSimple } from '$lib/MyTypes.js';
	import Information from '$lib/Information.svelte';
    let { data } = $props();

    let activeURL = $derived(page.url.pathname);
    let activeURLHash = $derived(page.url.hash);

    let admins = $derived(data.admins);
    let employees = $derived(data.employees);

    // sidebar state and visibility 
    let sidebarOpen = $state(false);
    const toggleSidebar = () => {
        sidebarOpen = !sidebarOpen;
    };

    let user: UserSimple = {
        loggedIn: !!page.data.session?.user,
        name: page.data.session?.user?.name || "Not logged in",
        email: page.data.session?.user?.email || "",
        avatar: page.data.session?.user?.image || ""
    }

</script>

<CustomNavbar
{user}
hasSidebar={true} 
sidebarOpen={sidebarOpen}
toggle={toggleSidebar} 
/>

<CustomSidebar
sidebarOpen={sidebarOpen}
activeUrl={activeURLHash}
toggle={toggleSidebar}
/>

<div id="content" class="h-dvh bg-gray-100 pt-16">
    {#if activeURLHash == "#employees"}
        <EmployeesPage {employees} />
    {:else if activeURLHash == "#mailings"}
        <MailingPage {employees} />
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