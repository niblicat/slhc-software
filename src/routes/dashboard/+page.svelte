<svelte:head>
	<link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet"/>
    <link href="https://cdn.jsdelivr.net/npm/flowbite@2.5.1/dist/flowbite.min.css" rel="stylesheet" />

</svelte:head>

<script lang="ts"  src="../path/to/flowbite/dist/flowbite.min.js">
    export let data;

    import { page } from '$app/stores';
	import CustomNavbar from '$lib/CustomNavbar.svelte';
	import CustomSidebar from '$lib/CustomSidebar.svelte';
	import EmployeesPage from '$lib/EmployeesPage.svelte';
    import MailingPage from '$lib/MailingPage.svelte';
    import InsertEmployeePage from '$lib/InsertEmployeePage.svelte';
    import InsertDataPage from '$lib/InsertDataPage.svelte';
    import AdminPage from '$lib/AdminPage.svelte';

    $: activeURL = $page.url.pathname;
    $: activeURLHash = $page.url.hash;

    $: admins = data.admins;
    $: employees = data.employees;

    // sidebar state and visibility 
    let sidebarOpen = false;
    const toggleSidebar = () => {
        sidebarOpen = !sidebarOpen;
    };

    // TODO: get these from google auth
    let name = "example name";
    let email = "example email";
</script>

<CustomNavbar
name={name}
email={email}
hasSidebar={true} 
sidebarOpen={sidebarOpen}
on:toggle={toggleSidebar} 
/>

<CustomSidebar
sidebarOpen={sidebarOpen}
activeURLHash={activeURLHash}
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
    <InsertDataPage/>
{:else}
    <!-- User who is not logged in should be redirected to home (no hash) -->
    <p>You are on the dashboard. Use the sidebar to navigate to a page</p>
{/if}