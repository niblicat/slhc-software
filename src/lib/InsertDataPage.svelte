<script lang="ts">

    import { Label, Input, ButtonGroup} from 'flowbite-svelte';
    import { Dropdown, Search, Button } from 'flowbite-svelte';
    import { ChevronDownOutline } from 'flowbite-svelte-icons';
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
    import { sql } from '@vercel/postgres';

    import type { Employee } from './MyTypes';
    import AdminPage from './AdminPage.svelte';
	import { invalidateAll } from '$app/navigation';
	import ErrorMessage from './ErrorMessage.svelte';
	import { error } from '@sveltejs/kit';
	import { isNumber } from './utility';
	import SuccessMessage from './SuccessMessage.svelte';

    interface Props {
        employees?: Array<Employee>,
        showEmployeesDropdown?: boolean,
        showYears?: boolean,
        year?: string,
        employee?: Employee
    }

    let { employees = [], showYears = true, showEmployeesDropdown = false, year, employee }: Props = $props();

    const undefinedEmployee: Employee = {
        employeeID: "-1",
        firstName: "Undefined",
        lastName: "Undefined",
        email: "Undefined",
        dob: "Undefined",
        activeStatus: "Undefined"
    };

    const undefinedEmployeeSearchable: EmployeeSearchable = $state({
        name: "Select an employee",
        data: undefinedEmployee
    });

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

    let selectedEmployee: EmployeeSearchable = $state(undefinedEmployeeSearchable);

    let inputValueName: string = $state("");

    // When the user types into the selection text box, the employees list should filter
    let filtered_employees = $derived(employee_dict.filter(item => item.name.toLowerCase().includes(inputValueName.toLowerCase())));

    // Functions to update selected employee and year
    const selectEmployee = (employee: EmployeeSearchable) => {
        selectedEmployee = employee;
        nameMenuOpen = false; 
    };

    let showDataFields = $state((employee && year) ? true : false);

    let nameMenuOpen = $state(false);

    let inputValueYear = $state("");
    let leftFrequencies = $state({
        hz500: "",
        hz1000: "",
        hz2000: "",
        hz3000: "",
        hz4000: "",
        hz6000: "",
        hz8000: ""
    });
    let rightFrequencies = $state({
        hz500: "",
        hz1000: "",
        hz2000: "",
        hz3000: "",
        hz4000: "",
        hz6000: "",
        hz8000: ""
    });

    let success = $state(true);
    let errorMessage = $state("");
    let successMessage = $state("");

    function displayError(message: string) {
        errorMessage = message;
        success = false;
    }

    function preprocessFrequencies(frequencies: Record<string, string>) {
        return Object.fromEntries(
            Object.entries(frequencies).map(([key, value]) => [
                key, 
                value.trim().toUpperCase() === "CNT" ? null : value
            ])
        );
    }

    async function checkYearAvailabilityKeydown(e: KeyboardEvent) {
        if (e.key == "Enter") {
            await checkYearAvailability();
        }
    }

    const earliestYear = 1957;

    async function checkYearAvailability() {
        // Some checks to see if our ducks are in a row
        if (!employee && selectedEmployee == undefinedEmployeeSearchable) {
            displayError("No employee was selected!");
            return;
        }
        if (!isNumber(inputValueYear)) {
            displayError("The year is not a number...");
            return;
        }
        const yearAsInteger = parseInt(inputValueYear);
        if (yearAsInteger < earliestYear) {
            displayError(`The selected year is before ${earliestYear}. Please choose a valid year.`);
            return;
        }
        const currentYear = new Date().getFullYear();
        if (yearAsInteger > currentYear) {
            displayError(`The selected year is after ${currentYear}. Please choose a valid year.`);
            return;
        }
        
        const formData = new FormData();

        const appendedEmployeeID = employee ? employee.employeeID : selectedEmployee.data.employeeID;
        formData.append('id', appendedEmployeeID); // Pass id
        const appendedYear = year ? year : inputValueYear;
        formData.append('year', appendedYear); // Year of data

        const response = await fetch('/dashboard?/checkYearAvailability', {
            method: 'POST',
            body: formData,
        });
        showDataFields = false;
        try {
            console.log('Raw server response:', response);
            const serverResponse = await response.json()
            const result = JSON.parse(JSON.parse(serverResponse.data)[0]);

            if (result["success"]) {
                success = true;
                showDataFields = true;
            } else {
                displayError(result["message"] ?? "Failed to add check available years.");
                
            }
        } 
        catch (error: any) {
            console.error('Error during fetch or JSON parsing: ', error.message ?? 'no defined error message');
            displayError(error.message ?? 'An error occurred');
        }
    }

    async function addHearingData() {
        const formData = new FormData();
        formData.append('leftEarFrequencies', JSON.stringify(preprocessFrequencies(leftFrequencies))); // Left ear data
        formData.append('rightEarFrequencies', JSON.stringify(preprocessFrequencies(rightFrequencies))); // Right ear data

        const appendedEmployeeID = employee ? employee.employeeID : selectedEmployee.data.employeeID;
        formData.append('id', appendedEmployeeID); // Pass id
        const appendedYear = year ? year : inputValueYear;
        formData.append('year', appendedYear); // Year of data

        // Debug: Log form data
        console.log('Form data to be sent:', Object.fromEntries(formData.entries()));

        const response = await fetch('/dashboard?/addHearingData', {
            method: 'POST',
            body: formData,
        });

        try {
            // Debug: Log raw response
            console.log('Raw server response:', response);
            const serverResponse = await response.json()
            const result = JSON.parse(JSON.parse(serverResponse.data)[0]);

            if (result["success"]) {
                success = true;
                await invalidateAll();
            } else {
                displayError(result["message"] ?? "Failed to add employee data.");
            }
        } 
        catch (error: any) {
            console.error('Error during fetch or JSON parsing: ', error.message ?? 'no defined error message');
            displayError(error.message ?? 'An error occurred');
        }
    }

</script>

<p class="center text-2xl">Add New Data</p>

<SuccessMessage {success} {successMessage} />
<ErrorMessage {success} {errorMessage} />

<div class="dropdown-container flex-container form"> 
    {#if showEmployeesDropdown}
        <!-- Select Employee Dropdown -->
        <div style="width: 300px;">
            <Label for="employee" class="block mb-2">Select Employee</Label>
            <Button class="bg-light-bluegreen hover:bg-dark-bluegreen text-black text-base flex justify-between items-center" style="width:300px">{selectedEmployee.name}<ChevronDownOutline class="w-6 h-6 ms-2 text-white dark:text-white" /></Button>
            <Dropdown bind:open={nameMenuOpen} class="overflow-y-auto px-3 pb-3 text-sm h-44">
            <div  class="p-3">
                <Search size="md" bind:value={inputValueName}/>
            </div>
                {#each filtered_employees as filtedEmployee}
                    <li class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <button type="button" class="w-full text-left" onclick={() => selectEmployee(filtedEmployee)}>
                            {filtedEmployee.name}
                        </button>
                    </li>
                {/each}
            </Dropdown>
        </div>
    {/if}
    
    {#if showYears}
        <!-- Add Year Input -->
        <div style="width: 300px; margin-left: 16px;">
            <Label for="year" class="block mb-2">Add Year</Label>
            <ButtonGroup class="w-full">
                <Input id="year" placeholder="1957" 
                    bind:value={inputValueYear} on:keydown={checkYearAvailabilityKeydown} />
                <Button color="blue" on:click={checkYearAvailability}>
                    Check
                </Button>
            </ButtonGroup>
        </div>
    {/if}
</div>

{#if showDataFields}
    <Table> <!--  style="width: 90%; text-align: center; margin: auto;" -->
        <TableHead>
            <TableHeadCell></TableHeadCell>
            <TableHeadCell>500 Hz</TableHeadCell>
            <TableHeadCell>1000 Hz</TableHeadCell>
            <TableHeadCell>2000 Hz</TableHeadCell>
            <TableHeadCell>3000 Hz</TableHeadCell>
            <TableHeadCell>4000 Hz</TableHeadCell>
            <TableHeadCell>6000 Hz</TableHeadCell>
            <TableHeadCell>8000 Hz</TableHeadCell>
        </TableHead>
        <TableBody tableBodyClass="divide-y">
        <TableBodyRow>
            <TableBodyCell>Left Ear</TableBodyCell>
            <TableBodyCell><Input bind:value={leftFrequencies.hz500} placeholder="500" required /></TableBodyCell>
            <TableBodyCell><Input bind:value={leftFrequencies.hz1000} placeholder="1000" required /></TableBodyCell>
            <TableBodyCell><Input bind:value={leftFrequencies.hz2000} placeholder="2000" required /></TableBodyCell>
            <TableBodyCell><Input bind:value={leftFrequencies.hz3000} placeholder="3000" required /></TableBodyCell>
            <TableBodyCell><Input bind:value={leftFrequencies.hz4000} placeholder="4000" required /></TableBodyCell>
            <TableBodyCell><Input bind:value={leftFrequencies.hz6000} placeholder="6000" required /></TableBodyCell>
            <TableBodyCell><Input bind:value={leftFrequencies.hz8000} placeholder="8000" required /></TableBodyCell>
        </TableBodyRow>
        <TableBodyRow>
            <TableBodyCell>Right Ear</TableBodyCell>
            <TableBodyCell><Input bind:value={rightFrequencies.hz500} placeholder="500" required /></TableBodyCell>
            <TableBodyCell><Input bind:value={rightFrequencies.hz1000} placeholder="1000" required /></TableBodyCell>
            <TableBodyCell><Input bind:value={rightFrequencies.hz2000} placeholder="2000" required /></TableBodyCell>
            <TableBodyCell><Input bind:value={rightFrequencies.hz3000} placeholder="3000" required /></TableBodyCell>
            <TableBodyCell><Input bind:value={rightFrequencies.hz4000} placeholder="4000" required /></TableBodyCell>
            <TableBodyCell><Input bind:value={rightFrequencies.hz6000} placeholder="6000" required /></TableBodyCell>
            <TableBodyCell><Input bind:value={rightFrequencies.hz8000} placeholder="8000" required /></TableBodyCell>
        </TableBodyRow>
        </TableBody>
    </Table>

    <div class="form">
        <Button 
            class="bg-light-bluegreen hover:bg-dark-bluegreen text-black" 
            style="width:200px" 
            on:click={addHearingData}>
            Submit
        </Button>
    </div>
{/if}

<style>
    /* TODO: Turn these into tailwind classes */
    .center {
        margin: auto;
        width: 50%;
        padding: 10px;
        text-align: center;
    }
    .form {
        margin: auto;
        width: 60%;
        padding: 20px;
        text-align: center;
    }
    .flex-container {
        display: flex;
        justify-content: center;
        gap: 16px; 
        width: 80%; 
        margin: auto;
    }
</style>