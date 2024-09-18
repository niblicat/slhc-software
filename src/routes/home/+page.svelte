<svelte:head>
	<link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet"/>
    <link href="https://cdn.jsdelivr.net/npm/flowbite@2.5.1/dist/flowbite.min.css" rel="stylesheet" />

</svelte:head>

<script lang="ts"  src="../path/to/flowbite/dist/flowbite.min.js">

    import { Button, Dropdown, DropdownItem, DropdownDivider, DropdownHeader, Search } from 'flowbite-svelte';
    import { ChevronDownOutline, UserRemoveSolid } from 'flowbite-svelte-icons';

    export let data;

    import Navbar from './lib/Navbar.svelte';
    import Sidebar from './lib/Sidebar.svelte';
    import Link from './lib/Link.svelte';
    import Input from './lib/DropdownInput.svelte';

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
</script>


<Sidebar bind:open/>
<Navbar bind:sidebar={open}/>

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

	/* Input field for search in dropdown */
	input {
		width: 100%;
		padding: 8px;
		box-sizing: border-box;
	}

	.selected-info {
		margin-top: 20px;
		padding: 20px;
		border: 1px solid #ccc;
		background-color: #f4f4f4;
	}
</style>