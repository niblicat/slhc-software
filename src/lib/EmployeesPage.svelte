<script lang="ts"  src="../path/to/flowbite/dist/flowbite.min.js">

    import { ButtonGroup, Button, Search } from 'flowbite-svelte';
    import { ChevronDownOutline, UserRemoveSolid } from 'flowbite-svelte-icons';
    import { Dropdown } from 'flowbite-svelte';
    import ScatterPlot from './ScatterPlot.svelte';
    import { Footer } from 'flowbite-svelte';
    import { sql } from '@vercel/postgres';

    import type { Employee } from './MyTypes';

    let chart: any;

    export let employees: Array<Employee>;

    // // Data for scatter plot
    const RightBaselineHearingData = [10,10,15,10,15,20,25];
    const RightNewHearingData = [15, 20, 25, 30, 35, 25, 45];
    const LeftBaselineHearingData = [15, 20, 20, 30, 25, 20, 15];
    const LeftNewHearingData = [15, 25, 25, 35, 20, 15, 10];

    // Selected employee and year
    let selectedYear = "No year selected";
    let selectedEmail = "No selection made";
    let selectedDOB = "No selection made";
    let selectAge = "No selection made";
    let selectedStatus = "No selection made";
    let STSstatus = "No data selection";

    let inputValueName: string = "";
    let inputValueYear = "";

    let success = true;
    let errorMessage = "";

    // Dropdown menu state
    let nameMenuOpen = false;
    let yearMenuOpen = false;

    // Chart Selection
    let isRightEar = false;
    let showBoth = true;

    const yearItems = ["2025","2024","2023","2022","2021","2020","2019","2018"];
    let filteredYears: Array<string> = yearItems;

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
    $: employee_dict = employees.map((employee) => ({
        name: `${employee.firstName} ${employee.lastName}`,
        data: employee
    })) as Array<EmployeeSearchable>;

    let selectedEmployee: EmployeeSearchable = {
        name: "Select an employee", 
        data: undefinedEmployee
    };

    // When the user types into the selection text box, the employees list should filter
    $: filtered_employees = employee_dict.filter(item => item.name.toLowerCase().includes(inputValueName.toLowerCase()));
    
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

        formData.append('employee', selectedEmployee.name);

        // Fetch employee details from the server
        try {
            const response = await fetch('/dashboard?/fetchEmployeeInfo', {
                method: 'POST',
                body: formData,
            });

            const serverResponse = await response.json();
            const result = JSON.parse(JSON.parse(serverResponse.data)[0]);

            if (result["success"]) {
                success = true;
                selectedEmail = result.employee.email;
                selectedDOB = result.employee.dob
                    ? new Date(result.employee.dob).toISOString().split('T')[0]
                    : "No selection made";
                selectedStatus = result.employee.employmentStatus;

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
        } 
        catch (error) {
            selectedEmail = "Error caught while fetching data";
            selectedDOB = "Error caught while fetching data";
            selectedStatus = "Error caught while fetching data";
        }
    };

    const selectYear = (year: string) => {
        selectedYear = year;
        yearMenuOpen = false; 
    };

    const yearHandleInput = () => {
        filteredYears = yearItems.filter(item => item.includes(inputValueYear));
    };

    // TODO: get these from google auth
    let name = "example name";
    let email = "example email";
</script>

<div class="relative dropdown-container flex space-x-4 justify-center" style="margin-top: 20px;"> 
    <!-- User Dropdown -->
    <Button class="bg-light-bluegreen hover:bg-dark-bluegreen text-black text-base flex justify-between items-center" style="width:300px">{selectedEmployee.name}<ChevronDownOutline class="w-6 h-6 ms-2 text-white dark:text-white" /></Button>
    <Dropdown bind:open={nameMenuOpen} class="overflow-y-auto px-3 pb-3 text-sm h-44">
    <div slot="header" class="p-3">
        <Search size="md" bind:value={inputValueName}/>
    </div>
    {#each filtered_employees as employee}
        <li class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
            <button type="button" class="w-full text-left" on:click={() => selectEmployee(employee)}>
                {employee.name}
            </button>
        </li>
    {/each}
    </Dropdown>

    <!-- Year Dropdown -->
    <Button class="bg-light-bluegreen hover:bg-dark-bluegreen text-black text-base flex justify-between items-center" style="width:300px">{selectedYear}<ChevronDownOutline class="w-6 h-6 ms-2 text-white dark:text-white" /></Button>
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
        <p>Employee: {selectedEmployee.name}</p> <br>
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