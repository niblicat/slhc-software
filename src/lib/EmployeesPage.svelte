<script lang="ts">

    import { ButtonGroup, Button, Search, Modal, Label, Input, Radio } from 'flowbite-svelte';
    import { ChevronDownOutline, UserRemoveSolid, UserAddSolid } from 'flowbite-svelte-icons';
    import { Dropdown } from 'flowbite-svelte';
    import ScatterPlot from './ScatterPlot.svelte';
    import { Footer } from 'flowbite-svelte';
    import EditIcon from './EditIcon.svelte';
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
    import { AnomolyStatus } from "./interpret";
    import type { Employee } from './MyTypes';
    import { invalidateAll } from '$app/navigation';
	import { controllers } from 'chart.js';
	import InsertEmployeePage from './InsertEmployeePage.svelte';

    let chart: any;

    interface Props {
        employees: Array<Employee>;
    }

    let { employees }: Props = $props();

    // Data for scatter plot
    let RightBaselineHearingData = $state<Array<number>>([]);
    let RightNewHearingData =  $state<Array<number>>([]);
    let LeftBaselineHearingData =  $state<Array<number>>([]);
    let LeftNewHearingData =  $state<Array<number>>([]);

    // Selected employee and year
    let selectedYear = $state("No year selected");
    let selectedEmail = $state("No data selected");
    let selectedDOB = $state("No data selected");
    let selectedAge = $state("No data selected");
    let selectedStatus = $state("No data selected");
    let STSstatusRight = $state("No data selected");
    let STSstatusLeft = $state("No data selected");
    let selectedSex = $state("No data selected");

    let modifiedLeftFrequencies = $state({
        hz500: '',
        hz1000: '',
        hz2000: '',
        hz3000: '',
        hz4000: '',
        hz6000: '',
        hz8000: ''
    });
    let modifiedRightFrequencies = $state({
        hz500: '',
        hz1000: '',
        hz2000: '',
        hz3000: '',
        hz4000: '',
        hz6000: '',
        hz8000: ''
    });

    let inputValueName: string = $state("");
    let inputValueYear = $state("");

    let success = true;
    let errorMessage = $state("");

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
        dob: "Undefined",
        activeStatus: "Undefined",
        sex: "Undefined"
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
        name: "No employee selected", 
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
                selectedStatus = dataResult.employee.employmentStatus;
                selectedDOB = dataResult.employee.dob
                    ? new Date(dataResult.employee.dob).toISOString().split('T')[0]
                    : "No selection made";
                selectedAge = calculateAge(selectedDOB);
                selectedSex = dataResult.employee.sex
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
                yearItems = yearsResult.years.map(String);
                console.log(yearItems);
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

    const calculateAge = (dobString: string | null): string => {
        if (!dobString) return "No selection made";

        const today = new Date();
        const dob = new Date(dobString);

        if (isNaN(dob.getTime())) return "Invalid Date";

        let age = today.getFullYear() - dob.getFullYear();

        // Check if the birthday has occurred this year
        if (
            today.getMonth() < dob.getMonth() || 
            (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
        ) {
            age--;
        }

        return age.toString();
    };

    let filteredYears = $derived.by(() => {
        let filterable = yearItems;
        let filter = inputValueYear

        return filterable.filter(item => item.includes(filter));
    });
   
    const selectYear = async (year: string) => {
        selectedYear = year;
        yearMenuOpen = false;

        try {
            await fetchUpdatedHearingData(selectedEmployee.name, year);

            const formData = new FormData();
            formData.append('employee', selectedEmployee.data.employeeID);
            formData.append('year', year);
            formData.append('age', selectedAge.toString()); //will probably need to send DOB in order to calculate age depending on year....
            formData.append('sex', selectedEmployee.data.sex);

            const response = await fetch('/dashboard?/calculateSTS', { 
                method: 'POST',
                body: formData,
            });

            const serverResponse = await response.json();
            console.log(response);

            const result = JSON.parse(JSON.parse(serverResponse.data)[0]);
    
            if (result["success"]) {
                success = true;

                // Find the test result that matches the selected year
                const selectedYearReport = result.hearingReport.find((report: any) => report.reportYear === parseInt(year, 10));

                if (selectedYearReport) {
                    STSstatusRight = GetAnomolyStatusText(selectedYearReport.rightStatus);
                    STSstatusLeft = GetAnomolyStatusText(selectedYearReport.leftStatus);

                    console.log(`STS Report for ${year} - RIGHT:`, STSstatusRight);
                    console.log(`STS Report for ${year} - LEFT:`, STSstatusLeft);
                } else {
                    console.warn(`No hearing report found for year: ${year}`);
                    STSstatusRight = "No Data";
                    STSstatusLeft = "No Data";
                }
            } else {
                throw new Error(serverResponse.error || "Failed to calculate STS");
            }

        } catch (error) {
            console.error('Error fetching hearing data:', error);
            displayError('Error fetching hearing data');
        }
    };

    // Helper function to get the readable status
    const GetAnomolyStatusText = (status: AnomolyStatus): string => {
        return AnomolyStatus[status] || "Unknown";
    };

    // Helper function to extract frequencies
    const extractFrequencies = (earData: Record<string, any>): number[] => {
        const { ear, ...frequencies } = earData; // Exclude the 'ear' property
        return Object.values(frequencies) as number[];  // Return all frequency values as an array of numbers
    };

    //DATA MODIFICATION STUFF
    let nameModal = $state(false); // controls the appearance of the employee name change window
    let emailModal = $state(false);
    let DOBmodal = $state(false);
    let activeStatusModal = $state(false);
    let editDataModal = $state(false);
    let addEmployeeModal = $state(false);

    let newFirstName = $state("");
    let newLastName = $state("");
    let newEmail = $state("");
    let newDOB = $state("");
    let newActiveStatus = $state("");
    let isInactive = $state(false);

    function showNameChangeModal(employee: Employee) {
        newFirstName = employee.firstName;
        newLastName = employee.lastName;
        nameModal = true;
    }
    function showEmailChangeModal(employee: Employee) {
        newEmail = employee.email;
        emailModal = true;
    }
    function showDOBChangeModal(employee: Employee) {
        newDOB = employee.dob
        selectedDOB = newDOB
                    ? new Date(newDOB).toISOString().split('T')[0]
                    : "No selection made";
        DOBmodal = true;
    }
    function showActiveStatusChangeModal(employee: Employee) {
        activeStatusModal = true;
    }

    function showAddEmployeeModal() {
        addEmployeeModal = true;
    }

    function showEditDataModal(employee: EmployeeSearchable) {
        if (!selectedYear || selectedYear === "No year selected") {
            displayError("Please select a year first.");
            return;
        }

        // Populate modal with existing hearing data (if available)
        modifiedLeftFrequencies = {
            hz500: LeftNewHearingData[0]?.toString() || '',
            hz1000: LeftNewHearingData[1]?.toString() || '',
            hz2000: LeftNewHearingData[2]?.toString() || '',
            hz3000: LeftNewHearingData[3]?.toString() || '',
            hz4000: LeftNewHearingData[4]?.toString() || '',
            hz6000: LeftNewHearingData[5]?.toString() || '',
            hz8000: LeftNewHearingData[6]?.toString() || ''
        };

        modifiedRightFrequencies = {
            hz500: RightNewHearingData[0]?.toString() || '',
            hz1000: RightNewHearingData[1]?.toString() || '',
            hz2000: RightNewHearingData[2]?.toString() || '',
            hz3000: RightNewHearingData[3]?.toString() || '',
            hz4000: RightNewHearingData[4]?.toString() || '',
            hz6000: RightNewHearingData[5]?.toString() || '',
            hz8000: RightNewHearingData[6]?.toString() || ''
        };``

        editDataModal = true;
    }

    async function modifyEmployeeName(employee: EmployeeSearchable): Promise<void> {
        const formData = new FormData();
        formData.append('employee', selectedEmployee.name);
        formData.append('newFirstName', newFirstName);
        formData.append('newLastName', newLastName);

        const response = await fetch('/dashboard?/modifyEmployeeName', {
            method: 'POST',
            body: formData,
        });

        try {
            const serverResponse = await response.json();
            console.log(response);

            const result = JSON.parse(JSON.parse(serverResponse.data)[0]);
    
            if (result["success"]) {
                success = true;
                selectedEmployee.name = `${newFirstName} ${newLastName}`;
                selectedEmployee.data.firstName = newFirstName;
                selectedEmployee.data.lastName = newLastName;
            }
            else {
                displayError(result["message"]);
            }
        }
        catch (error: any) {
            let errorMessage = error.message;
            displayError(errorMessage);
        }
    }
    async function modifyEmployeeEmail(employee: EmployeeSearchable): Promise<void> {
        const formData = new FormData();
        formData.append('employee', selectedEmployee.name);
        formData.append('newEmail', newEmail);

        const response = await fetch('/dashboard?/modifyEmployeeEmail', {
            method: 'POST',
            body: formData,
        });

        try {
            const serverResponse = await response.json();
            console.log(response);

            const result = JSON.parse(JSON.parse(serverResponse.data)[0]);
    
            if (result["success"]) {
                success = true;
                selectedEmployee.data.email = newEmail;
                selectedEmail = selectedEmployee.data.email;
            }
            else {
                displayError(result["message"]);
            }
        }
        catch (error: any) {
            let errorMessage = error.message;
            displayError(errorMessage);
        }
    }
    async function modifyEmployeeDOB(employee: EmployeeSearchable): Promise<void> {
        const formData = new FormData();
        formData.append('employee', selectedEmployee.name);
        formData.append('newDOB', newDOB);

        const response = await fetch('/dashboard?/modifyEmployeeDOB', {
            method: 'POST',
            body: formData,
        });

        try {
            const serverResponse = await response.json();
            console.log(response);

            const result = JSON.parse(JSON.parse(serverResponse.data)[0]);
    
            if (result["success"]) {
                success = true;
                selectedEmployee.data.dob = newDOB;
                selectedDOB = selectedEmployee.data.dob
                    ? new Date(selectedEmployee.data.dob).toISOString().split('T')[0]
                    : "No selection made";
                selectedAge = calculateAge(selectedDOB);
            }
            else {
                displayError(result["message"]);
            }
        }
        catch (error: any) {
            let errorMessage = error.message;
            displayError(errorMessage);
        }
    }
    async function modifyEmploymentStatus(employee: EmployeeSearchable): Promise<void> {
        const formData = new FormData();
        formData.append('employee', selectedEmployee.name);
        formData.append('newActiveStatus', newActiveStatus === "Active" ? "" : newActiveStatus); // Ensures the form key matches what backend expects

        const response = await fetch('/dashboard?/modifyEmployeeStatus', {
            method: 'POST',
            body: formData,
        });

        try {
            const serverResponse = await response.json();
            console.log(response);

            const result = JSON.parse(JSON.parse(serverResponse.data)[0]);
    
            if (result["success"]) {
                success = true;
                selectedEmployee.data.activeStatus = newActiveStatus;
                if (newActiveStatus === "") {  
                    selectedStatus = "Active";
                } else {  
                    selectedStatus = "Inactive";
                }
            }
            else {
                displayError(result["message"]);
            }
        }
        catch (error: any) {
            let errorMessage = error.message;
            displayError(errorMessage);
        }
    }

    async function modifyHearingData(employee: EmployeeSearchable, selectedYear: string): Promise<void> {
        const formData = new FormData();
        formData.append('user', selectedEmployee.name);
        formData.append('year', selectedYear);
        formData.append('leftEarFrequencies', JSON.stringify(modifiedLeftFrequencies)); // Left ear data
        formData.append('rightEarFrequencies', JSON.stringify(modifiedRightFrequencies)); // Right ear data

        try {
        const response = await fetch('/dashboard?/modifyHearingData', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Server returned error: ${response.statusText}`);
        }
            
        const serverResponse = await response.json();
        const result = JSON.parse(JSON.parse(serverResponse.data)[0]);

        if (result["success"]) {
            // Refresh data state after update
            await fetchUpdatedHearingData(selectedEmployee.name, selectedYear); //This should update the chart??
            editDataModal = false;
        } else {
            throw new Error(serverResponse.message);
        }
        } catch (error: any) {
            console.error('Error updating hearing data:', error);
            displayError(error.message || 'An error occurred');
        }
    }

    async function fetchUpdatedHearingData(employeeID: string, year: string) {
        try {
            const formData = new FormData();
            formData.append('employeeID', selectedEmployee.data.employeeID);
            formData.append('year', selectedYear);
            const response = await fetch('/dashboard?/fetchHearingData', {
                method: 'POST',
                body: formData,
            });
            
            const serverResponse = await response.json();
            const result = JSON.parse(JSON.parse(serverResponse.data)[0]);
            
            if (result["success"]) {
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
                displayError('Failed to fetch hearing data for the selected year');
            }
        }
        catch (error) {
            console.error('Error fetching hearing data:', error);
            displayError('Error fetching hearing data');
        }
    }

</script>

<div class="relative dropdown-container flex space-x-4" style="margin-top: 20px; margin-left: 20px;"> 
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

    <Button on:click={() => showAddEmployeeModal()} class="bg-light-bluegreen hover:bg-dark-bluegreen text-black text-base flex justify-between items-center" style="width:55px"><UserAddSolid/></Button>
    
    {#if selectedYear !== "No year selected"} 
        <Button on:click={() => showEditDataModal(selectedEmployee)} class="bg-light-bluegreen hover:bg-dark-bluegreen text-black text-base flex justify-between items-center" style="width:200px">Edit Employee's Data</Button>
    {/if} 
</div>

<!---------------------- DISPLAY INFO ---------------------->

<!-- MODALS -->
<Modal title="Change Employee Name" bind:open={nameModal} autoclose>
    <p>
        <span>Please provide an updated name for {selectedEmployee.data.firstName} {selectedEmployee.data.lastName}</span>
        <br>
        <br>
        <Label for="first" class="mb-2">First name</Label>
        <Input type="text" id="firstName" placeholder={selectedEmployee.data.firstName} bind:value={newFirstName} required />
        <Label for="last" class="mb-2">Last name</Label>
        <Input type="text" id="lastName" placeholder={selectedEmployee.data.lastName} bind:value={newLastName} required />
    
    </p>
    <svelte:fragment slot="footer">
    <Button class="bg-blue-200 hover:bg-blue-300 text-black" on:click={() => modifyEmployeeName(selectedEmployee)}>Confirm</Button>
    <Button class="bg-red-200 hover:bg-red-300 text-black">Cancel</Button>
    </svelte:fragment>
</Modal>

<Modal title="Change Employee Email" bind:open={emailModal} autoclose>
    <p>
        <span>Please provide an updated email for {selectedEmployee.data.firstName} {selectedEmployee.data.lastName} ({selectedEmployee.data.email})</span>
        <br>
        <br>
        <Label for="newEmail" class="mb-2">New Email</Label>
        <Input type="text" id="email" placeholder={selectedEmployee.data.email} bind:value={newEmail} required />
    </p>
    <svelte:fragment slot="footer">
    <Button class="bg-blue-200 hover:bg-blue-300 text-black" on:click={() => modifyEmployeeEmail(selectedEmployee)}>Confirm</Button>
    <Button class="bg-red-200 hover:bg-red-300 text-black">Cancel</Button>
    </svelte:fragment>
</Modal>

<Modal title="Change Employee Date of Birth" bind:open={DOBmodal} autoclose>
    <p>
        <span>Please provide an updated DOB for {selectedEmployee.data.firstName} {selectedEmployee.data.lastName}</span>
        <br>
        <br>
        <Label for="newEmail" class="mb-2">New Date</Label>
        <Input type="date" id="dob" placeholder={selectedEmployee.data.dob} bind:value={newDOB} required />
    </p>
    <svelte:fragment slot="footer">
    <Button class="bg-blue-200 hover:bg-blue-300 text-black" on:click={() => modifyEmployeeDOB(selectedEmployee)}>Confirm</Button>
    <Button class="bg-red-200 hover:bg-red-300 text-black">Cancel</Button>
    </svelte:fragment>
</Modal>

<Modal title="Change Employee Active Status" bind:open={activeStatusModal} autoclose>
    <p>
        <span>Please provide an updated employment status for {selectedEmployee.data.firstName} {selectedEmployee.data.lastName}</span>
        <br>
        <br>
        <Label for="newActiveStatus" class="mb-2">New Employment Status</Label>
        <Radio name="employmentStatus" bind:checked={isInactive} on:change={() => isInactive = false}>Active</Radio>
        <Radio name="employmentStatus" bind:checked={isInactive} on:change={() => isInactive = true}>Inactive</Radio>

        {#if isInactive}
            <Label for="lastActive" class="block mb-2">Last Active Date</Label>
            <Input id="lastActive" type="date" bind:value={newActiveStatus} />
        {/if}
    </p>
    <svelte:fragment slot="footer">
    <Button class="bg-blue-200 hover:bg-blue-300 text-black" on:click={() => modifyEmploymentStatus(selectedEmployee)}>Confirm</Button>
    <Button class="bg-red-200 hover:bg-red-300 text-black">Cancel</Button>
    </svelte:fragment>
</Modal>

<Modal size = 'xl' title="Change Employee Hearing Data" bind:open={editDataModal}> 
    <p>
        <span>Please provide updated data points for {selectedEmployee.data.firstName} {selectedEmployee.data.lastName} during year {selectedYear}</span>
        <br>
        <br>
        <Table>
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
                    <TableBodyCell><Input bind:value={modifiedLeftFrequencies.hz500} placeholder={`${LeftBaselineHearingData[0]}`} required /></TableBodyCell>
                    <TableBodyCell><Input bind:value={modifiedLeftFrequencies.hz1000} placeholder={`${LeftBaselineHearingData[1]}`} required /></TableBodyCell>
                    <TableBodyCell><Input bind:value={modifiedLeftFrequencies.hz2000} placeholder={`${LeftBaselineHearingData[2]}`} required /></TableBodyCell>
                    <TableBodyCell><Input bind:value={modifiedLeftFrequencies.hz3000} placeholder={`${LeftBaselineHearingData[3]}`} required /></TableBodyCell>
                    <TableBodyCell><Input bind:value={modifiedLeftFrequencies.hz4000} placeholder={`${LeftBaselineHearingData[4]}`} required /></TableBodyCell>
                    <TableBodyCell><Input bind:value={modifiedLeftFrequencies.hz6000} placeholder={`${LeftBaselineHearingData[5]}`} required /></TableBodyCell>
                    <TableBodyCell><Input bind:value={modifiedLeftFrequencies.hz8000} placeholder={`${LeftBaselineHearingData[6]}`} required /></TableBodyCell>
                </TableBodyRow>
                <TableBodyRow>
                    <TableBodyCell>Right Ear</TableBodyCell>
                    <TableBodyCell><Input bind:value={modifiedRightFrequencies.hz500} placeholder={`${RightBaselineHearingData[0]}`} required /></TableBodyCell>
                    <TableBodyCell><Input bind:value={modifiedRightFrequencies.hz1000} placeholder={`${RightBaselineHearingData[1]}`} required /></TableBodyCell>
                    <TableBodyCell><Input bind:value={modifiedRightFrequencies.hz2000} placeholder={`${RightBaselineHearingData[2]}`} required /></TableBodyCell>
                    <TableBodyCell><Input bind:value={modifiedRightFrequencies.hz3000} placeholder={`${RightBaselineHearingData[3]}`} required /></TableBodyCell>
                    <TableBodyCell><Input bind:value={modifiedRightFrequencies.hz4000} placeholder={`${RightBaselineHearingData[4]}`} required /></TableBodyCell>
                    <TableBodyCell><Input bind:value={modifiedRightFrequencies.hz6000} placeholder={`${RightBaselineHearingData[5]}`} required /></TableBodyCell>
                    <TableBodyCell><Input bind:value={modifiedRightFrequencies.hz8000} placeholder={`${RightBaselineHearingData[6]}`} required /></TableBodyCell>
                </TableBodyRow>
            </TableBody>
        </Table>
    </p>

    {#if errorMessage}
    <p class="text-red-500">{errorMessage}</p> <!-- Display error message if any -->
    {/if}

    <svelte:fragment slot="footer">
        <Button class="bg-blue-200 hover:bg-blue-300 text-black" on:click={() => { 
            modifyHearingData(selectedEmployee, selectedYear).then(() => {
                if (!errorMessage) {
                    editDataModal = false;  // Close modal if no error
                }
            });
        }}>Confirm</Button>        
    <Button class="bg-red-200 hover:bg-red-300 text-black" on:click={() => editDataModal = false}>Cancel</Button>
    </svelte:fragment>
</Modal>

<Modal title="Add Employee" bind:open={addEmployeeModal}>
    <InsertEmployeePage />
    <svelte:fragment slot="footer">
        <Button class="bg-red-200 hover:bg-red-300 text-black"
            on:click={() => addEmployeeModal = false}>
            Cancel
        </Button>
    </svelte:fragment>
</Modal>

<div class="flex-container">
    <!-- Information Section -->
    <section class="selected-info text-xl">
        <br>
        <p>Year: {selectedYear}</p> <br>
        <p>Employee: {selectedEmployee.name}
            {#if selectedEmployee.data.employeeID !== "-1"} 
                <EditIcon on:edit={() => showNameChangeModal(selectedEmployee.data)}/>
            {/if} 
        </p> <br>
        <p>Email: {selectedEmail}
            {#if selectedEmployee.data.email !== "Undefined"} 
                <EditIcon on:edit={() => showEmailChangeModal(selectedEmployee.data)}/> 
            {/if} 
        </p> <br>
        <p>Date of Birth: {selectedDOB}
            {#if selectedEmployee.data.dob !== "Undefined"} 
                <EditIcon on:edit={() => showDOBChangeModal(selectedEmployee.data)}/> 
            {/if} 
        </p> <br>
        <p>Age: {selectedAge}</p> <br>
        <p>Sex: {selectedSex}</p> <br>
        <p>Employment Status: {selectedStatus} <!-- inactive to active is not working // double check --> 
            {#if selectedEmployee.data.employeeID !== "-1"} 
                <EditIcon on:edit={() => showActiveStatusChangeModal(selectedEmployee.data)}/>
            {/if} 
        </p> <br>
        <p class="text-3xl">STS Status Right: {STSstatusRight}</p> <br>
        <p class="text-3xl">STS Status Left: {STSstatusLeft}</p> <br>
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