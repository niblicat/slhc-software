<script lang="ts"  src="../path/to/flowbite/dist/flowbite.min.js">

    import { Button, Search } from 'flowbite-svelte';
    import { ChevronDownOutline, UserRemoveSolid } from 'flowbite-svelte-icons';
    import { Dropdown } from 'flowbite-svelte';
    import { sql } from '@vercel/postgres';

    import { ChartPieSolid, GridSolid, MailBoxSolid, UserSolid, ArrowRightToBracketOutline, EditOutline } from 'flowbite-svelte-icons';
    import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Avatar, DropdownItem, DropdownHeader, DropdownDivider } from 'flowbite-svelte';

    export let data;

    // sidebar state and visibility 
    let sidebarOpen = false;
    const toggleSidebar = () => { sidebarOpen = !sidebarOpen; };

    // Dropdown menu state
    let nameMenuOpen = false;
    let yearMenuOpen = false;

    // Selected user and year
    let selectedUser = "No user selected";
    let selectedYear = "No year selected";
    let selectedEmail = "No selection made";
    let selectedDOB = "No selection made";
    let selectAge = "No selection made";
    let selectedStatus = "No selection made";

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

    interface User {
        username: string;
        password: string;
    }

    const users = data.users.map((row: User) => ({
        username: row.username,
        password: row.password
    })) as Array<User>;

    // TODO: get these from google auth
    let name = "example name";
    let email = "example email";
</script>


<div class="relative dropdown-container flex space-x-4 justify-center"> <!-- <div class="relative dropdown-container flex items-center justify-center min-h-screen space-y-4"> -->
    <!-- User Dropdown -->
    <Button class="bg-blue-200 hover:bg-blue-300 text-black" >{selectedUser}<ChevronDownOutline class="w-6 h-6 ms-2 text-white dark:text-white" /></Button>
    <Dropdown bind:open={nameMenuOpen} class="overflow-y-auto px-3 pb-3 text-sm h-44">
    <div slot="header" class="p-3">
        <Search size="md" bind:value={inputValueName} on:input={nameHandleInput}/>
    </div>
    {#each filteredNames as user}
        <li class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
            <button type="button" class="w-full text-left" on:click={() => selectUser(user)}>
                {user}
            </button>
        </li>
    {/each}
    </Dropdown>

    <!-- Year Dropdown -->
    <Button class="bg-blue-200 hover:bg-blue-300 text-black" >{selectedYear}<ChevronDownOutline class="w-6 h-6 ms-2 text-white dark:text-white" /></Button>
    <Dropdown bind:open={yearMenuOpen} class="overflow-y-auto px-3 pb-3 text-sm h-44">
    <div slot="header" class="p-3">
        <Search size="md" bind:value={inputValueYear} on:input={yearHandleInput}/>
    </div>
    {#each filteredYears as year}
        <li class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
            <button type="button" class="w-full text-left" on:click={() => selectYear(year)}>
                {year}
            </button>
        </li>
    {/each}
    </Dropdown>
</div>


<!---------------------- DISPLAY INFO ---------------------->
<section class="selected-info relative ml-16 text-xl">
    <p>Year: {selectedYear}</p>
	<p>User: {selectedUser}</p>
    <p>Email: {selectedEmail}</p>
    <p>Date of Birth: {selectedDOB}</p>
    <p>Age: {selectAge}</p>
    <p>Employment Status: {selectedStatus}</p>
</section>
