<script lang="ts"  src="../path/to/flowbite/dist/flowbite.min.js">

    import { Button, Search } from 'flowbite-svelte';
    import { ChevronDownOutline, UserRemoveSolid } from 'flowbite-svelte-icons';
    import { Dropdown } from 'flowbite-svelte';
    import ScatterPlot from './ScatterPlot.svelte';
    import { sql } from '@vercel/postgres';

    // chart
    let chart: any;

    export let data;

    // sidebar state and visibility 
    let sidebarOpen = false;
    const toggleSidebar = () => { sidebarOpen = !sidebarOpen; };

    // Chart Selection
    let isRightEar = true; // Initially showing the right ear chart

    const toggleChart = (ear: string) => {
        isRightEar = ear === 'right';
    };

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
    let STSstatus = "No data selection";

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

    // Data for scatter plot
    const RightBaselineHearingData = [10,10,15,10,15,20,25];
    const RightNewHearingData = [15, 20, 25, 30, 35, 25, 45];
    const LeftBaselineHearingData = [15, 20, 20, 30, 25, 20, 15];
    const LeftNewHearingData = [15, 25, 25, 35, 20, 15, 10];
</script>


<div class="relative dropdown-container flex space-x-4 justify-center"> 
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
<div class="flex-container">
    <!-- Information Section -->
    <section class="selected-info text-xl">
        <br>
        <p>Year: {selectedYear}</p> <br>
        <p>User: {selectedUser}</p> <br>
        <p>Email: {selectedEmail}</p> <br>
        <p>Date of Birth: {selectedDOB}</p> <br>
        <p>Age: {selectAge}</p> <br>
        <p>Employment Status: {selectedStatus}</p> <br>
        <p class="text-3xl">STS Status: {STSstatus}</p> <br>
    </section>

    <!-- Chart Section -->
    <div class="chart-container">
        <div>
            <Button class="bg-blue-200 hover:bg-blue-300 text-black"on:click={() => toggleChart('left')}>Left</Button>
            <Button class="bg-blue-200 hover:bg-blue-300 text-black" on:click={() => toggleChart('right')}>Right</Button> 
            <br><br>
        </div>
        {#if isRightEar}
            <p class="text-xl">Right Ear</p>
            <ScatterPlot 
                baselineHearingData={RightBaselineHearingData} 
                newHearingData={RightNewHearingData} 
            />
        {:else}
            <p class="text-xl">Left Ear</p>
            <ScatterPlot 
                baselineHearingData={LeftBaselineHearingData} 
                newHearingData={LeftNewHearingData} 
            />
        {/if}
    </div>
</div>

<style>
    .flex-container {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 10px; 
    }

    .selected-info {
        flex: 1; 
        margin-left: 75px; 
        margin-top: 75px; 
        max-width: 500px; 
    }
    .chart-container {
        flex: 1;  
        margin-right: 75px; 
        margin-top: 50px; 
        max-width: 550px; 
        text-align: center;
    }
</style>
