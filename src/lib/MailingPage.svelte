<script lang="ts">
    import { ButtonGroup, Button, Footer } from 'flowbite-svelte';
    import type { Employee } from './MyTypes';
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Checkbox, Modal, Tooltip } from 'flowbite-svelte';
    import { AnomolyStatus } from "./interpret";

    interface Props {
        employees: Array<Employee>;
    };

    let { employees }: Props = $props();

    // No need for employeesMap anymore; we directly work with the employees array
    let success = $state(true);
    let errorMessage = $state("");

    let STSstatusRight = $state("No data selected");
    let STSstatusLeft = $state("No data selected");

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
            sex: employee.sex
        }));
    }

    const createCSV = async (employeeList: Array<any>) => {
        const headers = [
            "Employee ID", "First Name", "Last Name", "Email", "Date of Birth", "Sex", "Year",
            "L-500", "L-1000", "L-2000", "L-3000", "L-4000", "L-6000", "L-8000",
            "R-500", "R-1000", "R-2000", "R-3000", "R-4000", "R-6000", "R-8000",
            "Left Status", "Right Status"
        ];

        // for set up and such
        const employee_IDs = employeeList.map(employee => employee.employeeID);
        const formData = new FormData();
        formData.append('employeeIDs', JSON.stringify(employee_IDs));
        const response = await fetch('/dashboard?/extractHearingData', { 
            method: 'POST',
            body: formData,
        });
        const serverResponse = await response.json();
        const result = JSON.parse(JSON.parse(serverResponse.data)[0]);

        // getting into the creation of the csv
        if (result["success"]) {
            // Map rows for each employee
            const rows = [];

            // Loop over each employee to process their data
            for (const employee of employeeList) {
                // Find all hearing data corresponding to this employee
                const csvHearingData = result.hearingData.filter(data => data.id === employee.employeeID);

                // Group hearing data by year
                const years = new Set(csvHearingData.map(data => data.year));

                // Loop through each year to combine data for both ears
                for (const year of years) {
                    let rowData = [
                        employee.employeeID,
                        employee.firstName,
                        employee.lastName,
                        employee.email,
                        employee.dob,
                        employee.sex,
                        year, 
                    ];

                    // Initialize variables to store the hearing data for both ears
                    let leftEarData = { hz500: 0, hz1000: 0, hz2000: 0, hz3000: 0, hz4000: 0, hz6000: 0, hz8000: 0 };
                    let rightEarData = { hz500: 0, hz1000: 0, hz2000: 0, hz3000: 0, hz4000: 0, hz6000: 0, hz8000: 0 };

                    // Filter data for the current year
                    const yearData = csvHearingData.filter(data => data.year === year);

                    // Assign left and right ear data
                    yearData.forEach(data => {
                        if (data.ear === 'left') {
                            leftEarData = { 
                                hz500: data.hz500 ?? 0, hz1000: data.hz1000 ?? 0, hz2000: data.hz2000 ?? 0, 
                                hz3000: data.hz3000 ?? 0, hz4000: data.hz4000 ?? 0, hz6000: data.hz6000 ?? 0, hz8000: data.hz8000 ?? 0 
                            };
                        } else if (data.ear === 'right') {
                            rightEarData = { 
                                hz500: data.hz500 ?? 0, hz1000: data.hz1000 ?? 0, hz2000: data.hz2000 ?? 0, 
                                hz3000: data.hz3000 ?? 0, hz4000: data.hz4000 ?? 0, hz6000: data.hz6000 ?? 0, hz8000: data.hz8000 ?? 0 
                            };
                        }
                    });

                    // Append left and right ear hearing data to row
                    rowData.push(
                        leftEarData.hz500, leftEarData.hz1000, leftEarData.hz2000, leftEarData.hz3000,
                        leftEarData.hz4000, leftEarData.hz6000, leftEarData.hz8000,
                        rightEarData.hz500, rightEarData.hz1000, rightEarData.hz2000, rightEarData.hz3000,
                        rightEarData.hz4000, rightEarData.hz6000, rightEarData.hz8000
                    );

                    // ADD STS CALCULATON !!! 
                    const formData = new FormData();
                    formData.append('employeeID', employee.employeeID);
                    formData.append('year', String(year));
                    formData.append('sex', employee.sex);

                    const response = await fetch('/dashboard?/calculateSTS', { 
                        method: 'POST',
                        body: formData,
                    });

                    const serverResponse = await response.json();

                    const result = JSON.parse(JSON.parse(serverResponse.data)[0]);
                    console.log(employee.firstName);
                    console.log("RESULT: ", result);
                    if (result["success"]) {
                        success = true;

                        // Find the test result that matches the selected year
                        const selectedYearReport = result.hearingReport.find((report: any) => report.reportYear === parseInt(String(year), 10));

                        if (selectedYearReport) {
                            STSstatusRight = GetAnomolyStatusText(selectedYearReport.rightStatus);
                            STSstatusLeft = GetAnomolyStatusText(selectedYearReport.leftStatus);

                            console.log(`STS Report for ${year} - LEFT:`, STSstatusLeft);
                            console.log(`STS Report for ${year} - RIGHT:`, STSstatusRight);
                        } else {
                            console.warn(`No hearing report found for year: ${year}`);
                            STSstatusRight = "No Data";
                            STSstatusLeft = "No Data";
                        }
                    } else {
                        throw new Error(serverResponse.error ?? "Failed to calculate STS!!");
                    }
                    rowData.push(STSstatusLeft, STSstatusRight);
                    rows.push(rowData.join(','));
                }
            }
            //console.log("RETURN OUTPUT: ", rows);
            return ([headers.join(','), ...rows].join('\n'));
        } 
        else {
            throw new Error(serverResponse.error ?? "Failed to gnerate report");
        }
    };

    // Helper function to get the readable status
    const GetAnomolyStatusText = (status: AnomolyStatus): string => {
        return AnomolyStatus[status] || "Unknown";
    };
    
    // Handle export functionality
    async function handleExport() {
        const employeeList = createEmployeeList(); // Get the list of all employees
        const csvContent = await createCSV(employeeList); // Generate CSV content

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
            <p class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">Select "Export to CSV" to begin the mail merge.</p>
            {#if !success}
            <p class="mt-1 text-sm font-normal text-red-600 dark:text-red-300">{errorMessage}</p>
            {/if}
        </caption>
        <TableHead>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Email</TableHeadCell>
            <TableHeadCell>ID</TableHeadCell>
            <TableHeadCell>Date of Birth</TableHeadCell>
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
                        {new Date(employee.dob).toLocaleDateString('en-US')}
                    </TableBodyCell>
                    <TableBodyCell>
                        {employee.employeeID}
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