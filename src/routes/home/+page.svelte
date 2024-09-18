<svelte:head>
	<link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet"/>
</svelte:head>

<script lang="ts"  src="../path/to/flowbite/dist/flowbite.min.js">
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

<!---------------------- DROP DOWN BUTTONS ---------------------->
<div class="dropdown-container">
    <!-- Employee Dropdown Section -->
    <!-- <section class="dropdown">
        <button on:click={() => nameMenuOpen = !nameMenuOpen} class="dropbtn">
            {"Select User"} ▼
        </button>

        <div class:show={nameMenuOpen} class="dropdown-content">
            <Input bind:inputValue={inputValueName} on:input={nameHandleInput} placeholder="Search Users..." />
            {#if filteredNames.length > 0}
                {#each filteredNames as user}
                    <button on:click={() => selectUser(user)}>{user}</button>
                {/each}
            {:else}
                <p>No results found</p>
            {/if}
        </div>
    </section> -->

    <!-- Year Dropdown Section -->
        <button id="dropdownSearchButton" data-dropdown-toggle="dropdownSearch" data-dropdown-placement="bottom" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">Dropdown search <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
            </svg>
        </button>
        <div id="dropdownSearch" class="z-10 hidden bg-white rounded-lg shadow w-60 dark:bg-gray-700">
            <div class="p-3">
              <label for="input-group-search" class="sr-only">Search</label>
              <div class="relative">
                <div class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
                </div>
                <input type="text" id="input-group-search" class="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search user">
              </div>
            </div>
            <ul class="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownSearchButton">
              <li>
                <div class="flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                  <input id="checkbox-item-11" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                  <label for="checkbox-item-11" class="w-full py-2 ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">Bonnie Green</label>
                </div>
              </li>
              <li>
                <div class="flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                    <input checked id="checkbox-item-12" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                    <label for="checkbox-item-12" class="w-full py-2 ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">Jese Leos</label>
                  </div>
              </li>
            </ul>
        </div>
        <!-- <button on:click={() => yearMenuOpen = !yearMenuOpen} class="dropbtn">
            {"Select Year"} ▼
        </button>

        <div class:show={yearMenuOpen} class="dropdown-content">
            <Input bind:inputValue={inputValueYear} on:input={yearHandleInput} placeholder="Search Years..." />
            {#if filteredYears.length > 0}
                {#each filteredYears as year}
                    <a href="#" on:click={() => selectYear(year)}>{year}</a>
                {/each}
            {:else}
                <p>No results found</p>
            {/if}
        </div> -->
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