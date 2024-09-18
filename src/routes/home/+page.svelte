<svelte:head>
	<link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet"/>
</svelte:head>

<script lang="ts">
    export let data;

    import Navbar from './lib/Navbar.svelte'
	import Sidebar from './lib/Sidebar.svelte'
    import Link from './lib/Link.svelte';
	import Input from './lib/DropdownInput.svelte';

	let nameMenuOpen = false;
    let yearMenuOpen = false;
    let open = false;
	let inputValueName = "";
    let inputValueYear = "";

	$: console.log(inputValueName);
    $: console.log(inputValueYear);
	
	const employeeItems = ["name1", "name2", "name3", "will need to connect this to database"]; //needs connecting
	const yearItems = ["2020", "2021", "2022", "will need to connect this to database"]; //needs connecting
    let filteredNames = [];
    let filteredYears = [];

	const nameHandleInput = () => {
		filteredNames = employeeItems.filter(item => item.toLowerCase().includes(inputValueName.toLowerCase()));
	};
    const yearHandleInput = () => {
		filteredYears = yearItems.filter(item => item.includes(inputValueYear));
	};
    function toggleNameMenu() {
        nameMenuOpen = !nameMenuOpen;
    }
    function toggleYearMenu() {
        yearMenuOpen = !yearMenuOpen;
    }

    /* User stuff i didn't touch*/
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
        <button on:click={toggleNameMenu} class="dropbtn">Search Employees</button>
        
        <div id="nameDropdown" class:show={nameMenuOpen} class="dropdown-content">		
            <Input bind:inputValue={inputValueName} on:input={nameHandleInput} />		
            <!-- Employee List -->
            {#if filteredNames.length > 0}
                {#each filteredNames as item}
                    <Link link={item} />
                {/each}
            {:else}
                {#each employeeItems as item}
                    <Link link={item} />
                {/each}
            {/if}		
        </div>	
    </section>

    <!-- Year Dropdown Section -->
    <section class="dropdown">
        <button on:click={toggleYearMenu} class="dropbtn">Search Years</button>
        
        <div id="yearDropdown" class:show={yearMenuOpen} class="dropdown-content">		
            <Input bind:inputValue={inputValueYear} on:input={yearHandleInput} />		
            <!-- Year List -->
            {#if filteredYears.length > 0}
                {#each filteredYears as item}
                    <Link link={item} />
                {/each}
            {:else}
                {#each yearItems as item}
                    <Link link={item} />
                {/each}
            {/if}		
        </div>	
    </section>
</div>

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
	:global(body) {
		padding: 10;
	}

    /* Dropdown container */
    .dropdown-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 20vh; /* Adjust as needed */
        gap: 30px; 
    }

    .dropdown {
        position: relative;
        display: inline-block;
    }
	
    .dropbtn {
        background-color: rgb(229, 229, 250);
        color: rgb(0, 0, 0);
        padding: 15px;
        width: 300px;
        font-size: 16px;
        border: none;
        cursor: pointer;
        z-index: 10;
    }
	
    .dropdown-content {
        display: none;
        position: absolute;
        background-color: #f6f6f6;
        min-width: 230px;
        border: 1px solid #000;
        z-index: 10;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    }

    .show {
        display: block;
    }

    /* Sidebar */
    .sidebar {
        position: fixed;
        top: 0;
        left: -100%;
        height: 100%;
        width: 250px;
        background-color: #111;
        z-index: 100;
        transition: left 0.3s ease-in-out;
    }

    .sidebar.open {
        left: 0;
    }
</style>