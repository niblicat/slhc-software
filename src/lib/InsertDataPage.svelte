<script lang="ts"  src="../path/to/flowbite/dist/flowbite.min.js">

    import { Label, Input, Button, Dropdown, Search } from 'flowbite-svelte';
    import { ChevronDownOutline } from 'flowbite-svelte-icons';
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
    import { sql } from '@vercel/postgres';

    import type { Employee } from './MyTypes';

    export let employees: Array<Employee>;

    const undefinedEmployee: Employee = {
        employeeID: "-1",
        firstName: "Undefined",
        lastName: "Undefined",
        email: "Undefined",
        dob: "Undefined"
    };

    type EmployeeSearchable = {
        name: string, // full name
        data: Employee
    }

    // $: employee_dict = employees.map((employee) => ({
    //     name: `${employee.firstName} ${employee.lastName}`,
    //     data: employee
    // })) as Array<EmployeeSearchable>;

    let selectedEmployee: EmployeeSearchable = {
        name: "Select an employee", 
        data: undefinedEmployee
    };

    let nameMenuOpen = false;
    let inputValueName: string = "";
    // let filteredNames: Array<string> = [];

    let inputValueYear = "";
    let filteredYears: Array<string> = [];

    // When the user types into the selection text box, the employees list should filter
    // $: filtered_employees = employee_dict.filter(item => item.name.toLowerCase().includes(inputValueName.toLowerCase()));


    // Functions to update selected user 
    const selectEmployee = (employee: EmployeeSearchable) => {
        selectedEmployee = employee;
        nameMenuOpen = false; 
    };

</script>

<div class="center text-2xl">Add New Data</div>

<div class="dropdown-container flex-container form"> 
    <!-- Select Employee Dropdown -->
    <div style="width: 300px;">
        <Label for="employee" class="block mb-2">Select Employee</Label>
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
    </div>

    <!-- Add Year Input -->
    <div style="width: 300px; margin-left: 16px;">
        <Label for="year" class="block mb-2">Add Year</Label>
        <Input id="year" placeholder="year" />
    </div>
</div>
	
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
        <TableBodyCell><Input id="hz_500" placeholder="500" required/></TableBodyCell>
        <TableBodyCell><Input id="hz_1000" placeholder="1000" required/></TableBodyCell>
        <TableBodyCell><Input id="hz_2000" placeholder="2000" required/> </TableBodyCell>
        <TableBodyCell><Input id="hz_3000" placeholder="3000" required/></TableBodyCell>
        <TableBodyCell><Input id="hz_4000" placeholder="4000" required/></TableBodyCell>
        <TableBodyCell><Input id="hz_6000" placeholder="6000" required/></TableBodyCell>
        <TableBodyCell><Input id="hz_8000" placeholder="8000" required/></TableBodyCell>
      </TableBodyRow>
      <TableBodyRow>
        <TableBodyCell>Right Ear</TableBodyCell>
        <TableBodyCell><Input id="hz_500" placeholder="500" required/></TableBodyCell>
        <TableBodyCell><Input id="hz_1000" placeholder="1000" required/></TableBodyCell>
        <TableBodyCell><Input id="hz_2000" placeholder="2000" required/></TableBodyCell>
        <TableBodyCell><Input id="hz_3000" placeholder="3000" required/></TableBodyCell>
        <TableBodyCell><Input id="hz_4000" placeholder="4000" required/></TableBodyCell>
        <TableBodyCell><Input id="hz_6000" placeholder="6000" required/></TableBodyCell>
        <TableBodyCell><Input id="hz_8000" placeholder="8000" required/></TableBodyCell>
      </TableBodyRow>
    </TableBody>
  </Table>

  <div class="form">
    <Button class="bg-light-bluegreen hover:bg-dark-bluegreen text-black" style="width:200px">Submit</Button>
</div>

<style>
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