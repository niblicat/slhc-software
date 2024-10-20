<script lang="ts"  src="../path/to/flowbite/dist/flowbite.min.js">

    import { Button, Search } from 'flowbite-svelte';
    import { ChevronDownOutline, UserRemoveSolid } from 'flowbite-svelte-icons';
    import { Dropdown } from 'flowbite-svelte';
    import { sql } from '@vercel/postgres';
    import { onMount } from "svelte";
    import { Chart, registerables } from 'chart.js';

    // chart
    let chart: any;

    export let data;

    // sidebar state and visibility 
    let sidebarOpen = false;
    const toggleSidebar = () => {
        sidebarOpen = !sidebarOpen;
    };

    // Dropdown menu state
    let nameMenuOpen = false;
    let yearMenuOpen = false;

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
    const baselineHearingData = [10,10,15,10,15,20,25];
    const newHearingData = [15, 20, 25, 30, 35, 40, 45];

    // Custom tick values
    const customTicksX = [500, 1000, 2000, 3000, 4000, 6000, 8000];
    const customTicksY = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0, -10];

    // Initialize chart on mount
    onMount(() => {
        Chart.register(...registerables); // Register necessary components

        const ctx = document.getElementById("scatterPlot") as HTMLCanvasElement;
        chart = new Chart(ctx, {
            type: "scatter", // Scatter plot type
            data: {
                datasets: [{
                        label: 'L/R Baseline',
                        data: customTicksX.map((p, i) => ({ x: p, y: baselineHearingData[i] })),
                        backgroundColor: 'rgba(75, 192, 192, 1)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    },
                    {
                        label: 'L/R Current Year Data',
                        data: customTicksX.map((p, i) => ({ x: p, y: newHearingData[i] })),
                        backgroundColor: 'rgba(255, 99, 132, 1)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                    }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'Frequency (Hz)'
                        },
                        min: Math.min(...customTicksX),  // Ensure the x-axis starts from the minimum value of custom ticks
                        max: Math.max(...customTicksX),  // Ensure the x-axis ends at the maximum value of custom ticks
                        ticks: {
                            values: customTicksX,  // Set exact tick values
                            autoSkip: false,  // Ensure no ticks are skipped
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Hearing Level (dB)'
                        },
                        min: Math.min(...customTicksY),  // Ensure the y-axis starts from the minimum value of custom ticks
                        max: Math.max(...customTicksY),  // Ensure the y-axis ends at the maximum value of custom ticks
                        ticks: {
                            values: customTicksY,  // Set exact tick values
                            autoSkip: false,  // Ensure no ticks are skipped
                        },
                        reverse: true
                    }
                }
            }
        });
    });
</script>


<div class="dropdown-container flex space-x-4">
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
<section class="selected-info">
	<h1>Selected Information:</h1>
    <p>Year: {selectedYear}</p>
	<p>User: {selectedUser}</p>
    <p>Email: ---</p>
    <p>Date of Birth: ---</p>
    <p>Age: ---</p>
    <p>Employment Status: ---</p>
</section>

<div class="chart-container">
    <canvas id="scatterPlot" width="400" height="400"></canvas>
</div>

<style>
    .chart-container {
        position: relative;
        height: 400px;
        width: 400px;
    }
</style>