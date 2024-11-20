<svelte:head>
	<link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet"/>
    <link href="https://cdn.jsdelivr.net/npm/flowbite@2.5.1/dist/flowbite.min.css" rel="stylesheet" />

</svelte:head>

<script lang="ts"  src="../path/to/flowbite/dist/flowbite.min.js">
    export let data;
    import { Li, List, Heading } from 'flowbite-svelte';
    import { AccordionItem, Accordion } from 'flowbite-svelte';
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
    <EmployeesPage
    {data}
    />
{:else if activeURLHash == "#mailings"}
    <MailingPage/>
{:else if activeURLHash == "#admin"}
    <AdminPage/>
{:else if activeURLHash == "#insert"}
    <InsertEmployeePage/>
{:else if activeURLHash == "#data"}
    <InsertDataPage/>
{:else}
    <!-- User who is not logged in should be redirected to home (no hash) -->
    <div class="center text-2xl">Welcome to the dashboard</div>
      
        <Accordion>
        <AccordionItem>
            <span slot="header">Learn about the Admins Page</span>
            <p class="text-gray-500 dark:text-gray-400">
            <Li>Make other registered users admins by clicking the edit icon in the "is admin" column</Li>
            <Li>Edit information about any admin by clicking the edit icon next to the item or the "edit" button in the far right columm</Li>
            <Li>Delete admin(s) by selecting the box in the far left column then clicking the delete button towards the bottom</Li>
            </p>
        </AccordionItem>
        <AccordionItem>
            <span slot="header">Learn about the Employees Page</span>
            <Li>Select an employee and year from the drop down menus towards the top</Li>
            <Li>Employee information is displayed on the left and the hearing data graph is displayed on the right</Li>
            <Li>Select the "Print" button to print out this information</Li>
            <Li>Select the "Send Letter" button to print out this information</Li>
            <br>
            <Accordion class="bg-gray-100">
                <AccordionItem>
                    <span slot="header">Learn more about the graph</span>
                    <p class="text-gray-500 dark:text-gray-400"></p>
                    <Li>The graph has a "Left," "Right," and "Both" option to view specific sides</Li>
                    <Li>Hovering and clicking on points of the graph give the specific coordinates</Li>
                    <Li>Selecting the colors in the top legend with disable/enable that specific data set from being shown</Li>
                </AccordionItem>
            </Accordion>
        </AccordionItem>
        <AccordionItem>
            <span slot="header">Learn about the Mailings Page Page</span>
            <List tag="ul" class="ps-5 mt-2 space-y-1">
                <Li>Select the "Mail Merge" button to start a mail merge</Li>
                <Li>more info to come soon</Li>
            </List>
            </AccordionItem>
            <AccordionItem>
            <span slot="header">Learn about the Insert Employee Page</span>
            <Li>Input the employee's first name, last name, SIUE email, date of birth, and employement status</Li>
                <Li>If the employee is not employeed, a new input menu appears to add in their last employement date</Li>
                <Li>Once information is inputted, click submit to add them to the employee table</Li>
            </AccordionItem>
            <AccordionItem>
            <span slot="header">Learn about the Insert Data Page</span>
            <Li>Select employee to add data to and input year</Li>
                <Li>Input left and right ear data</Li>
                <Li>Submit information to add it to the data table</Li>
            </AccordionItem>
        </Accordion>

{/if}


<style>
    .center {
        margin: auto;
        width: 50%;
        padding: 30px;
        text-align: center;
    }
  </style>