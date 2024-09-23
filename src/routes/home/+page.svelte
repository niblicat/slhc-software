<svelte:head>
	<link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet"/>
    <link href="https://cdn.jsdelivr.net/npm/flowbite@2.5.1/dist/flowbite.min.css" rel="stylesheet" />

</svelte:head>

<script lang="ts"  src="../path/to/flowbite/dist/flowbite.min.js">

    import { Button, Search } from 'flowbite-svelte';
    import { ChevronDownOutline, UserRemoveSolid } from 'flowbite-svelte-icons';
    import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Avatar, Dropdown, DropdownItem, DropdownHeader, DropdownDivider } from 'flowbite-svelte';
    import { Sidebar, SidebarBrand, SidebarCta, SidebarDropdownItem, SidebarDropdownWrapper, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';

    import { page } from '$app/stores';
    import { ChartPieSolid, GridSolid, MailBoxSolid, UserSolid, ArrowRightToBracketOutline, EditOutline } from 'flowbite-svelte-icons';
    import { fade } from 'svelte/transition';
	import CustomAvatar from '../customavatar.svelte';
    let spanClass = 'flex-1 ms-3 whitespace-nowrap';
    $: activeUrl = $page.url.pathname;
    export let data;

    // sidebar state and visibility 
    let sidebarOpen = false;
    const toggleSidebar = () => {
        sidebarOpen = !sidebarOpen;
    };

    // Dropdown menu state
    let nameMenuOpen = false;
    let yearMenuOpen = false;
    let open = false;

    // Selected user and year
    let selectedUser = "No user selected";
    let selectedYear = "No year selected";

    let inputValueName = "";
    let inputValueYear = "";
    let filteredNames: Array<string> = [];
    let filteredYears: Array<string> = [];

    // Employee and year data for demo purposes -- still need to connect to database
    const employeeItems = ["Jayme", "Jared", "Angel"];
    const yearItems = ["2022", "2023", "2024"];

    // Initialize filtered names and years with default data
    filteredNames = employeeItems;
    filteredYears = yearItems;

    // Functions to update selected user and year
    const selectUser = (user: string) => {
        selectedUser = user;
        nameMenuOpen = false; 
    };

    const selectYear = (year: string) => {
        selectedYear = year;
        yearMenuOpen = false; 
    };

    const nameHandleInput = () => {
        filteredNames = employeeItems.filter(item => item.toLowerCase().includes(inputValueName.toLowerCase()));
    };

    const yearHandleInput = () => {
        filteredYears = yearItems.filter(item => item.includes(inputValueYear));
    };

    /* User stuff i didnt touch */
    $: users = data.users.map(row => ({
        username: row.username,
        password: row.password
    })) as Array<{ username: string; password: string }>;

    // TODO: get these from google auth
    let name = "example name";
    let email = "example email";
</script>

<Navbar rounded color="form" class="flex justify-between items-center">
    <div class="fixed top-4 left-4 z-50">
        <button class="relative w-8 h-8" on:click={toggleSidebar}>
            {#if sidebarOpen}
                <!-- X icon when sidebar is open -->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="absolute inset-0 w-full h-full">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            {:else}
                <!-- Hamburger icon using SVG -->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="absolute inset-0 w-full h-full">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            {/if}
        </button>
    </div>
    <NavBrand href="/" class="flex-grow text-center">
        <span class="text-2xl font-semibold dark:text-white">SIUE SLHC Employee Hearing Panel</span>
    </NavBrand>
    <CustomAvatar name={name} email={email} />
</Navbar>

<!-- Overlay background for when sidebar is open-->
{#if sidebarOpen}
  <button class="fixed inset-0 bg-black opacity-50 z-40" on:click={toggleSidebar}></button>
{/if}

<!-- Sidebar -->
<div class={`fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-full h-screen`}>
    <Sidebar {activeUrl} class="h-full">
        <!-- Content wrapper inside the sidebar with padding to push content down -->
        <SidebarWrapper class="h-full overflow-y-auto pt-16"> <!-- Add padding here -->
            <SidebarGroup>
                <SidebarItem label="Admin" href="#admin">
                    <UserSolid class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                </SidebarItem>
                <SidebarItem label="Employees" href="#employees">
                    <GridSolid class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                </SidebarItem>
                <SidebarItem label="Mailings" href="#mailings">
                    <MailBoxSolid class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                </SidebarItem>
                <SidebarItem label="Insert Employees" href="#insert">
                    <ArrowRightToBracketOutline class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                </SidebarItem>
            </SidebarGroup>
        </SidebarWrapper>
    </Sidebar>
</div>

<div class="dropdown-container">
    <Button>{selectedUser}<ChevronDownOutline class="w-6 h-6 ms-2 text-white dark:text-white" /></Button>
    <Dropdown class="overflow-y-auto px-3 pb-3 text-sm h-44">
    <div slot="header" class="p-3">
        <Search size="md" bind:value={inputValueName}/>
    </div>
    {#each filteredNames as user}
        <li class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
            <button on:click={() => selectUser(user)}>{user}</button>
        </li>
    {/each}
    </Dropdown>
    <Button>{selectedYear}<ChevronDownOutline class="w-6 h-6 ms-2 text-white dark:text-white" /></Button>
    <Dropdown class="overflow-y-auto px-3 pb-3 text-sm h-44">
    <div slot="header" class="p-3">
        <Search size="md" bind:value={inputValueYear}/>
    </div>
    {#each filteredYears as year}
        <li class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
            <button on:click={() => selectYear(year)}>{year}</button>
        </li>
    {/each}
    </Dropdown>
</div>

<!---------------------- DISPLAY INFO ---------------------->
<section class="selected-info">
	<h1>Selected Information:</h1>
    <p>Year: {selectedYear}</p>
	<p>User: {selectedUser}</p>
    <p>Email: ---</p>
    <p>Date of Birth: ---</p>
    <p>Age: ---</p>
    <p>Employment Status: ---</p>
</section>

<!-- User stuff i didn't touch -->
<h1>Users</h1>
<div>
    <ul>
        {#each users as { username, password } (username)}
            <li><div>{username} - {password}</div></li>
        {/each}
    </ul>
</div>

<!---------------------- STYLE //had issues on separate page so i out it all here ---------------------->
<style>
	/* Center the dropdown buttons container */
	.dropdown-container {
		display: flex;
		justify-content: center; 
		align-items: center; 
		height: 100vh; 
        height: 20vh; 
        gap: 30px; 
	}

	/* Show the dropdown menu */
	.show {
		display: block;
	}

	.selected-info {
		margin-top: 20px;
		padding: 20px;
		border: 1px solid #ccc;
		background-color: #f4f4f4;
	}

    .overlay {
    background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black */
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 40; /* Lower than the hamburger and sidebar */
  }

  /* Sidebar styles */
  .sidebar-open {
    transform: translateX(0);
  }

  .sidebar-closed {
    transform: translateX(-100%);
  }

  .sidebar-content {
    padding-top: 4rem; /* Adjust as needed based on the height of the hamburger */
  }

  .hamburger-icon, .x-icon {
    width: 2rem; 
    height: 2rem;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>