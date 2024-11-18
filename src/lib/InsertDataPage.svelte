<script lang="ts"  src="../path/to/flowbite/dist/flowbite.min.js">

    import { Label, Input, Helper} from 'flowbite-svelte';
    import { Button } from 'flowbite-svelte';
    import { Dropdown, Search } from 'flowbite-svelte';
    import { ChevronDownOutline, UserRemoveSolid } from 'flowbite-svelte-icons';
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Checkbox, TableSearch } from 'flowbite-svelte';

    let nameMenuOpen = false;
    let selectedUser = "No user selected";

    let inputValueName = "";
    let filteredNames: Array<string> = [];

    // Employee and year data for demo purposes -- still need to connect to database
    const employeeItems = ["Jayme", "Jared", "Angel"];

    filteredNames = employeeItems;

    // Functions to update selected user 
    const selectUser = (user: string) => {
        selectedUser = user;
        nameMenuOpen = false; 
    };
    
    const nameHandleInput = () => {
        filteredNames = employeeItems.filter(item => item.toLowerCase().includes(inputValueName.toLowerCase()));
    };

    interface User {
        username: string;
        password: string;
    }
</script>

<div class="center text-2xl">Add New Data</div>

<div class="dropdown-container flex-container form"> 
    <!-- Select Employee Dropdown -->
    <div style="width: 300px;">
        <Label for="employee" class="block mb-2">Select Employee</Label>
        <Button class="bg-light-bluegreen hover:bg-dark-bluegreen text-black flex justify-between items-center" style="width: 100%">{selectedUser}<ChevronDownOutline class="w-6 h-6 ms-2 text-white dark:text-white" /></Button>
        <Dropdown bind:open={nameMenuOpen} class="overflow-y-auto px-3 pb-3 text-sm h-44">
            <div slot="header" class="p-3">
                <Search size="md" bind:value={inputValueName} on:input={nameHandleInput} />
            </div>
            {#each filteredNames as user}
                <li class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                    <button type="button" class="w-full text-left" on:click={() => selectUser(user)}>
                        {user}
                    </button>
                </li>
            {/each}
        </Dropdown>
    </div>

    <!-- Add Year Input -->
    <div style="width: 300px; margin-left: 16px;">
        <Label for="year" class="block mb-2">Add Year</Label>
        <Input id="year" placeholder="xxxx" />
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
        <TableBodyCell><Input id="hz_500" required/></TableBodyCell>
        <TableBodyCell><Input id="hz_1000" required/></TableBodyCell>
        <TableBodyCell><Input id="hz_2000" required/> </TableBodyCell>
        <TableBodyCell><Input id="hz_3000" required/></TableBodyCell>
        <TableBodyCell><Input id="hz_4000" required/></TableBodyCell>
        <TableBodyCell><Input id="hz_6000" required/></TableBodyCell>
        <TableBodyCell><Input id="hz_8000" required/></TableBodyCell>
      </TableBodyRow>
      <TableBodyRow>
        <TableBodyCell>Right Ear</TableBodyCell>
        <TableBodyCell><Input id="hz_500" required/></TableBodyCell>
        <TableBodyCell><Input id="hz_1000" required/></TableBodyCell>
        <TableBodyCell><Input id="hz_2000" required/></TableBodyCell>
        <TableBodyCell><Input id="hz_3000" required/></TableBodyCell>
        <TableBodyCell><Input id="hz_4000" required/></TableBodyCell>
        <TableBodyCell><Input id="hz_6000" required/></TableBodyCell>
        <TableBodyCell><Input id="hz_8000" required/></TableBodyCell>
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