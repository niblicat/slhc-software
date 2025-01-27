<script lang="ts">

    import { ButtonGroup, Button, Search } from 'flowbite-svelte';
    import { ChevronDownOutline, UserRemoveSolid } from 'flowbite-svelte-icons';
    import { Dropdown } from 'flowbite-svelte';
    import ScatterPlot from './ScatterPlot.svelte';
    import { Footer } from 'flowbite-svelte';
    import { sql } from '@vercel/postgres';
    import { onMount } from 'svelte';

    import type { Employee } from './MyTypes';
    import { invalidateAll } from '$app/navigation';
	import { controllers } from 'chart.js';

    let chart: any;

    interface Props {
        employees: Array<Employee>;
    }

    let { employees }: Props = $props();

    //Testing purposes
    let test = $state("");

    // Data for scatter plot
    let RightBaselineHearingData = $state<Array<number>>([]);
    let RightNewHearingData =  $state<Array<number>>([]);
    let LeftBaselineHearingData =  $state<Array<number>>([]);
    let LeftNewHearingData =  $state<Array<number>>([]);

    // Selected employee and year
    let selectedYear = $state("No year selected");
    let selectedEmail = $state("No data selected");
    let selectedDOB = $state("No data selected");
    let selectAge = $state("No data selected");
    let selectedStatus = $state("No data selected");
    let STSstatus = "No data selection";

    let inputValueName: string = $state("");
    let inputValueYear = $state("");

    let success = true;
    let errorMessage = "";

    // Dropdown menu state
    let nameMenuOpen = $state(false);
    let yearMenuOpen = $state(false);

    // Chart Selection
    let isRightEar = $state(false);
    let showBoth = $state(true);

    let yearItems = $state<Array<string>>([]);

    function displayError(message: string) {
        errorMessage = message;
        success = false;
    }

    const undefinedEmployee: Employee = {
        employeeID: "-1",
        firstName: "Undefined",
        lastName: "Undefined",
        email: "Undefined",
        dob: "Undefined"
    };

    // used to make it easier to access employees from their full name
    type EmployeeSearchable = {
        name: string, // full name
        data: Employee
    }

    // employee map that is search friendly
    // name will hold first and last so it's easier to search
    // actual employee data (id and stuff) is in employee_dict.data
    let employee_dict = $derived(employees.map((employee) => ({
        name: `${employee.firstName} ${employee.lastName}`,
        data: employee
    })) as Array<EmployeeSearchable>);

    let selectedEmployee: EmployeeSearchable = $state({
        name: "Select an employee", 
        data: undefinedEmployee
    });

    // When the user types into the selection text box, the employees list should filter
    let filteredEmployees = $derived(employee_dict.filter(item => item.name.toLowerCase().includes(inputValueName.toLowerCase())));
    
    const toggleChart = (ear: string) => {
        if (ear === 'both') {
            showBoth = true;
        } else {
            isRightEar = ear === 'right';
            showBoth = false;
        }
    };

    // Functions to update selected employee and year
    const selectEmployee = async (employee: EmployeeSearchable) => {
        const formData = new FormData();

        selectedEmployee = employee;
        nameMenuOpen = false; 

        // Reset year selection and clear years dropdown
        selectedYear = "No year selected";
        yearItems = [];
        inputValueYear = "";
        // Clear previous data
        RightBaselineHearingData.length = 0;
        RightNewHearingData.length = 0;
        LeftBaselineHearingData.length = 0;
        LeftNewHearingData.length = 0;

        formData.append('employee', selectedEmployee.name);

        // Fetch employee details from the server and years for other dropdown
        try {
            // data stuff first
            const dataResponse = await fetch('/dashboard?/fetchEmployeeInfo', {
                method: 'POST',
                body: formData,
            });
            const serverDataResponse = await dataResponse.json();
            const dataResult = JSON.parse(JSON.parse(serverDataResponse.data)[0]);

            if (dataResult["success"]) {
                success = true;
                selectedEmail = dataResult.employee.email;
                selectedDOB = dataResult.employee.dob
                    ? new Date(dataResult.employee.dob).toISOString().split('T')[0]
                    : "No selection made";
                selectedStatus = dataResult.employee.employmentStatus;

                if (selectedDOB !== "No selection made") {
                    const today = new Date();
                    const dob = new Date(selectedDOB);

                    // Calculate the difference in years
                    let age = today.getFullYear() - dob.getFullYear();

                    // Check if the current month and day have passed the birth month and day
                    if (
                        today.getMonth() < dob.getMonth() || 
                        (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
                    ) {
                        age--; // Decrease the age by 1 if the birthday hasn't occurred yet this year
                    }

                    selectAge = age.toString();
                } 
                else {
                    selectAge = "No selection made";
                }
            }
            else {
                selectedEmail = "Error fetching data: not a data success";
                selectedDOB = "Error fetching data: not a data success";
                selectedStatus = "Error fetching data: not a data success";
            }

            // years stuff next
            const yearsResponse = await fetch('/dashboard?/fetchYears', {
                method: 'POST',
                body: formData,
            });

            const serverYearsResponse = await yearsResponse.json();
            const yearsResult = JSON.parse(JSON.parse(serverYearsResponse.data)[0]);

            console.log(yearsResult);

            if (yearsResult["success"]) {
                success = true;
                //await invalidateAll();
                yearItems = yearsResult.years.map(String);
                console.log(yearItems);
                // filteredYears is not updating!!
                //yearItems = [];
                //yearItems = yearItems; // idk
            }
            else {
                yearItems = [];
                displayError('No years found for the selected employee');
            }

        } 
        catch (error) {
            console.error('Error fetching data:', error);
            yearItems = [];
            displayError('Error fetching data');
        }
    };

    let filteredYears = $derived.by(() => {
        let filterable = yearItems;
        let filter = inputValueYear

        return filterable.filter(item => item.includes(filter));
    });
   
    const selectYear = async (year: string) => {
        selectedYear = year;
        yearMenuOpen = false;

        const formData = new FormData();
        formData.append('employeeID', selectedEmployee.name);
        formData.append('year', year);

        try {
            const response = await fetch('/dashboard?/fetchHearingData', {
                method: 'POST',
                body: formData,
            });
            const serverResponse = await response.json();
            const result = JSON.parse(JSON.parse(serverResponse.data)[0]);
            
            if (result["success"]) {
                test = "SUCCESS!!!";

                const { baselineData, newData } = result.hearingData;

                // Clear previous data
                RightBaselineHearingData.length = 0;
                RightNewHearingData.length = 0;
                LeftBaselineHearingData.length = 0;
                LeftNewHearingData.length = 0;

                // Extract frequencies and populate arrays

                // For right ear baseline data
                if (baselineData.rightEar) {
                    RightBaselineHearingData.push(...extractFrequencies(baselineData.rightEar));
                }

                // For right ear new data
                if (newData.rightEar) {
                    RightNewHearingData.push(...extractFrequencies(newData.rightEar));
                }

                // For left ear baseline data
                if (baselineData.leftEar) {
                    LeftBaselineHearingData.push(...extractFrequencies(baselineData.leftEar));
                }

                // For left ear new data
                if (newData.leftEar) {
                    LeftNewHearingData.push(...extractFrequencies(newData.leftEar));
                }
            } 
            else {
                test = "FAIL!!"
                displayError('Failed to fetch hearing data for the selected year');
            }
        } catch (error) {
            test = "error :("
            console.error('Error fetching hearing data:', error);
            displayError('Error fetching hearing data');
        }
    };

    // Helper function to extract frequencies
    const extractFrequencies = (earData: Record<string, any>): number[] => {
        const { ear, ...frequencies } = earData; // Exclude the 'ear' property
        return Object.values(frequencies) as number[];  // Return all frequency values as an array of numbers
    };


    // TODO: get these from google auth
    let name = "example name";
    let email = "example email";
</script>

<div class="relative dropdown-container flex space-x-4 justify-center" style="margin-top: 20px;"> 
    <!-- User Dropdown -->
    <Button class="bg-light-bluegreen hover:bg-dark-bluegreen text-black text-base flex justify-between items-center" style="width:300px">{selectedEmployee.name}<ChevronDownOutline class="w-6 h-6 ms-2 text-white dark:text-white" /></Button>
    <Dropdown bind:open={nameMenuOpen} class="overflow-y-auto px-3 pb-3 text-sm h-44">
        <div  class="p-3">
            <Search size="md" bind:value={inputValueName}/>
        </div>
        {#each filteredEmployees as employee}
            <li class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                <button type="button" class="w-full text-left" onclick={() => selectEmployee(employee)}>
                    {employee.name}
                </button>
            </li>
        {/each}
    </Dropdown>

    <!-- Year Dropdown -->
    <Button class="bg-light-bluegreen hover:bg-dark-bluegreen text-black text-base flex justify-between items-center" style="width:300px">{selectedYear}<ChevronDownOutline class="w-6 h-6 ms-2 text-white dark:text-white" /></Button>
    <Dropdown bind:open={yearMenuOpen} class="overflow-y-auto px-3 pb-3 text-sm h-44">
        <div  class="p-3">
            <Search size="md" bind:value={inputValueYear}/>
        </div>
        {#each filteredYears as year}
            <li class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                <button type="button" class="w-full text-left" onclick={() => selectYear(year)}>
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
        <p>Employee: {selectedEmployee.name}</p> <br>
        <p>Email: {selectedEmail}</p> <br>
        <p>Date of Birth: {selectedDOB}</p> <br>
        <p>Age: {selectAge}</p> <br>
        <p>Employment Status: {selectedStatus}</p> <br>
        <p class="text-3xl">STS Status: {STSstatus}</p> <br>

        <!-- Testing Purposes -->
         <!--
        <br><br><br>
        <p>Testing Output</p>
        <p>HEARING DATA SUCCESS RESULT: {test}</p> <br>
        <p>HEARING DATA TEST NEW R: {RightNewHearingData}</p> <br>
        <p>HEARING DATA TEST NEW L: {LeftNewHearingData}</p> <br>
        <p>HEARING DATA TEST BL R: {RightBaselineHearingData}</p> <br>
        <p>HEARING DATA TEST BL L: {LeftBaselineHearingData}</p> <br>
        -->
    </section>

    <!-- Chart Section -->
    <div class="chart-container">
        {#if showBoth}
            <ScatterPlot 
                plotTitle="Both Ears"
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
            <Button class="bg-light-bluegreen hover:bg-dark-bluegreen text-black text-base" style="width:175px" on:click={() => toggleChart('left')}>Left</Button>
            <Button class="bg-light-bluegreen hover:bg-dark-bluegreen text-black text-base" style="width:175px" on:click={() => toggleChart('right')}>Right</Button> 
            <Button class="bg-light-bluegreen hover:bg-dark-bluegreen text-black text-base" style="width:175px" on:click={() => toggleChart('both')}>Both</Button> 
        </ButtonGroup>
    </div>
</div>

 <Footer class="sticky bottom-0 w-full bg-white dark:bg-gray-900">
    <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
    <div class="sm:flex sm:items-center sm:justify-between">
        <ButtonGroup class="*:!ring-primary-700" style="width:100%">
            <Button class="bg-light-bluegreen hover:bg-dark-bluegreen text-black text-lg" style="width:50%">Print</Button>
            <Button class="bg-light-bluegreen hover:bg-dark-bluegreen text-black text-lg" style="width:50%">Send Letter</Button>
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