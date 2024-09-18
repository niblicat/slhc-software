<svelte:head>
	<link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet"/>
</svelte:head>

<script lang="ts">
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
    let filteredNames = [];
    let filteredYears = [];

    // Employee and year data for demo purposes -- still need to connect to database
    const employeeItems = ["Jayme", "Jared", "Angel"];
    const yearItems = ["2022", "2023", "2024"];

    // Initialize filtered names and years with default data
    filteredNames = employeeItems;
    filteredYears = yearItems;

    // Functions to update selected user and year
    const selectUser = (user) => {
        selectedUser = user;
        nameMenuOpen = false; 
    };

    const selectYear = (year) => {
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
    <section class="dropdown">
        <button on:click={() => nameMenuOpen = !nameMenuOpen} class="dropbtn">
            {"Select User"} ▼
        </button>

        <div class:show={nameMenuOpen} class="dropdown-content">
            <Input bind:inputValue={inputValueName} on:input={nameHandleInput} placeholder="Search Users..." />
            {#if filteredNames.length > 0}
                {#each filteredNames as user}
                    <a href="#" on:click={() => selectUser(user)}>{user}</a>
                {/each}
            {:else}
                <p>No results found</p>
            {/if}
        </div>
    </section>

    <!-- Year Dropdown Section -->
    <section class="dropdown">
        <button on:click={() => yearMenuOpen = !yearMenuOpen} class="dropbtn">
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
        </div>
    </section>
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

	/* Dropdown container */
	.dropdown {
		position: relative;
		display: inline-block;
		margin: 10px;
	}

	/* Dropdown button */
	.dropbtn {
		background-color: rgb(229, 229, 250);
		color: black;
		padding: 16px;
		font-size: 16px;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 300px; /* Adjust to make the buttons longer */
	}

	/* Dropdown content (hidden by default) */
	.dropdown-content {
		display: none;
		position: absolute;
		background-color: #f9f9f9;
		min-width: 300px; /* Make sure dropdown content matches button width */
		box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
		z-index: 1;
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

	/* Links inside the dropdown */
	.dropdown-content a {
		color: black;
		padding: 12px 16px;
		text-decoration: none;
		display: block;
		cursor: pointer;
	}

	.selected-info {
		margin-top: 20px;
		padding: 20px;
		border: 1px solid #ccc;
		background-color: #f4f4f4;
	}
</style>