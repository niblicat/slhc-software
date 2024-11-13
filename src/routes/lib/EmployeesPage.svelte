<script lang="ts"  src="../path/to/flowbite/dist/flowbite.min.js">

    import { ButtonGroup, Button, Search } from 'flowbite-svelte';
    import { ChevronDownOutline, UserRemoveSolid } from 'flowbite-svelte-icons';
    import { Dropdown } from 'flowbite-svelte';
    import ScatterPlot from './ScatterPlot.svelte';
    import { Footer } from 'flowbite-svelte';
    import { sql } from '@vercel/postgres';
    import "$lib/app.css";

    // chart
    let chart: any;

    export let data;

    // Chart Selection
    let isRightEar = false;
    let showBoth = true;
    
    const toggleChart = (ear: string) => {
        if (ear === 'both') {
            showBoth = true;
        } else {
            isRightEar = ear === 'right';
            showBoth = false;
        }
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

    // const users = data.users.map((row: User) => ({
    //     username: row.username,
    //     password: row.password
    // })) as Array<User>;

    const users = [
        {username: "testname", password: "testpassword"}
    ]


    // TODO: get these from google auth
    let name = "example name";
    let email = "example email";

    // Data for scatter plot
    const RightBaselineHearingData = [10,10,15,10,15,20,25];
    const RightNewHearingData = [15, 20, 25, 30, 35, 25, 45];
    const LeftBaselineHearingData = [15, 20, 20, 30, 25, 20, 15];
    const LeftNewHearingData = [15, 25, 25, 35, 20, 15, 10];
</script>

<div class="relative dropdown-container flex space-x-4 justify-center" style="margin-top: 20px;"> 
    <!-- User Dropdown -->
    <Button class="bg-blue-200 hover:bg-blue-300 text-black flex justify-between items-center" style="width:300px">{selectedUser}<ChevronDownOutline class="w-6 h-6 ms-2 text-white dark:text-white" /></Button>
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
    <Button class="bg-blue-200 hover:bg-blue-300 text-black flex justify-between items-center" style="width:300px">{selectedYear}<ChevronDownOutline class="w-6 h-6 ms-2 text-white dark:text-white" /></Button>
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
        {#if showBoth}
            <ScatterPlot 
                plotTitle="Overlay: Both Ears"
                baselineHearingData={RightBaselineHearingData.concat(LeftBaselineHearingData)}
                newHearingData={RightNewHearingData.concat(LeftNewHearingData)}
                labels={['Right Baseline', 'Right New', 'Left Baseline', 'Left New']}
            />
        {:else if isRightEar}
            <ScatterPlot 
                plotTitle="Right Ear"
                baselineHearingData={RightBaselineHearingData} 
                newHearingData={RightNewHearingData} 
                labels={['Right Baseline', 'Right New']}
            />
        {:else}
            <ScatterPlot 
                plotTitle="Left Ear"
                baselineHearingData={LeftBaselineHearingData} 
                newHearingData={LeftNewHearingData} 
                labels={['Left Baseline', 'Left New']}
            />
        {/if}
        <ButtonGroup class="*:!ring-primary-700">
            <Button class="bg-blue-200 hover:bg-blue-300 text-black" style="width:175px" on:click={() => toggleChart('left')}>Left</Button>
            <Button class="bg-blue-200 hover:bg-blue-300 text-black" style="width:175px" on:click={() => toggleChart('right')}>Right</Button> 
            <Button class="bg-blue-200 hover:bg-blue-300 text-black" style="width:175px" on:click={() => toggleChart('both')}>Both</Button> 
        </ButtonGroup>
    </div>
</div>

 <Footer class="sticky bottom-0 w-full bg-white dark:bg-gray-900">
    <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
    <div class="sm:flex sm:items-center sm:justify-between">
        <ButtonGroup class="*:!ring-primary-700" style="width:100%">
            <Button class="bg-blue-200 hover:bg-blue-300 text-black" style="width:50%">Print</Button>
            <Button class="bg-blue-200 hover:bg-blue-300 text-black" style="width:50%">Send Letter</Button>
        </ButtonGroup>
    </div>
 </Footer>

<style>
    .flex-container {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }
    .selected-info {
        flex: 1; 
        margin-left: 75px; 
        margin-top: 55px; 
        max-width: 500px; 
    }
    .chart-container {
        flex: 1;  
        margin-right: 75px; 
        margin-top: 15px; 
        max-width: 550px; 
        text-align: center;
    }
</style>
