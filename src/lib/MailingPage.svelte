<script lang="ts">
    import { ButtonGroup, Button, Footer } from 'flowbite-svelte';
    import type { Employee } from './MyTypes';
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Checkbox, Modal, Tooltip } from 'flowbite-svelte';

    interface Props {
        employees: Array<Employee>;
    };

    let { employees }: Props = $props();

    // No need for employeesMap anymore; we directly work with the employees array
    let success = $state(true);
    let errorMessage = $state("");

    function displayError(message: string) {
        errorMessage = message;
        success = false;
    }

    // Function to create an array of employees (no filtering needed)
    function createEmployeeList() {
        return employees.map((employee) => ({
            employeeID: employee.employeeID,
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            dob: employee.dob,
        }));
    }

    // Function to create CSV content from the employee list
    function createCSV(employeeList: Array<any>) {
        const headers = ["Employee ID", "First Name", "Last Name", "Email", "Date of Birth"];
        const rows = employeeList.map(employee => 
            `${employee.employeeID},${employee.firstName},${employee.lastName},${employee.email},${employee.dob}`
        );
        return [headers.join(','), ...rows].join('\n');
    }

    // Handle export functionality
    async function handleExport() {
        const employeeList = createEmployeeList(); // Get the list of all employees
        const csvContent = createCSV(employeeList); // Generate CSV content

        let enrichedEmployeeList = [];

        for (const employee of employeeList) {
            try {
                const response = await fetch('/dashboard?/fetchHearingData', )
            }
        }

        if (employeeList.length > 0) {
            downloadCSV(csvContent); // Call the function to download the CSV
        } else {
            displayError("No employees to export.");
        }
    }

    // Function to trigger file download
    function downloadCSV(csvContent: string) {
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'employees.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
</script>

<div class="flex-column justify-center mx-4">
    <Table hoverable={true} class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <caption class="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
            Mail Merge Page
            <p class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">Select anyone or everyone for a mail merge.</p>
            {#if !success}
            <p class="mt-1 text-sm font-normal text-red-600 dark:text-red-300">{errorMessage}</p>
            {/if}
        </caption>
        <TableHead>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Email</TableHeadCell>
            <TableHeadCell>ID</TableHeadCell>
            <TableHeadCell>Date of Birth</TableHeadCell>
            <!-- <TableHeadCell>Date</TableHeadCell> -->
            <!-- <TableHeadCell>Data</TableHeadCell> -->
        </TableHead>
        <TableBody tableBodyClass="divide-y">
            {#each employees as employee (employee.employeeID)}
                <TableBodyRow>
                    <TableBodyCell>
                        {employee.firstName} {employee.lastName}
                    </TableBodyCell>
                    <TableBodyCell>
                        {employee.email}
                    </TableBodyCell>
                    <TableBodyCell>
                        {employee.employeeID}
                    </TableBodyCell>
                    <TableBodyCell>
                        {new Date(employee.dob).toLocaleDateString('en-US')}
                    </TableBodyCell>
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
</div>

<Footer class="sticky bottom-0 w-full bg-white dark:bg-gray-900">
    <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
    <div class="sm:flex sm:items-center sm:justify-between">
        <ButtonGroup class="*:!ring-primary-700" style="width:100%">
            <Button class="bg-light-bluegreen hover:bg-dark-bluegreen text-black text-lg" style="width:50%">
                Send Letter
            </Button>
            <Button class="bg-light-bluegreen hover:bg-dark-bluegreen text-black text-lg" style="width:50%" on:click={handleExport}>
                Export to CSV
            </Button>            
        </ButtonGroup>
    </div>
</Footer>
