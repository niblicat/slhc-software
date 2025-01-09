<script lang="ts"  src="../path/to/flowbite/dist/flowbite.min.js">

    import { Label, Input} from 'flowbite-svelte';
    import { Button } from 'flowbite-svelte';
    import { Dropdown, Search } from 'flowbite-svelte';
    import { ChevronDownOutline } from 'flowbite-svelte-icons';
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';

    let nameMenuOpen = false;
    let selectedUser = "No user selected";

    let inputValueName = "";
    let filteredNames: Array<string> = [];

    // Employee and year data for demo purposes -- still need to connect to database
    const employeeItems = ["Jayme", "Jared", "Angel"];

    filteredNames = employeeItems;

    // Form input values
    let year = "";
    let leftEarFrequencies = {
        hz500: "",
        hz1000: "",
        hz2000: "",
        hz3000: "",
        hz4000: "",
        hz6000: "",
        hz8000: "",
    };
    let rightEarFrequencies = {
        hz500: "",
        hz1000: "",
        hz2000: "",
        hz3000: "",
        hz4000: "",
        hz6000: "",
        hz8000: "",
    };

    // Functions to update selected user 
    const selectUser = (user: string) => {
        selectedUser = user;
        nameMenuOpen = false; 
    };
    
    const nameHandleInput = () => {
        filteredNames = employeeItems.filter(item => item.toLowerCase().includes(inputValueName.toLowerCase()));
    };

    // interface User {
    //     username: string;
    //     password: string;
    // }

    async function submitData() {
        if (!selectedUser || !year || Object.values(leftEarFrequencies).some(v => !v) || Object.values(rightEarFrequencies).some(v => !v)) {
            alert("Please fill in all fields.");
            return;
        }

        const payload = {
            user: selectedUser,
            year,
            leftEarFrequencies,
            rightEarFrequencies,
        };

        try {
            const response = await fetch('/api/insert-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (response.ok) {
                alert("Data submitted successfully!");
                // Clear the form
                resetForm();
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            alert(`Error submitting data: ${error}`);
        }
    }

    function resetForm() {
        selectedUser = "No user selected";
        year = "";
        Object.keys(leftEarFrequencies).forEach(key => (leftEarFrequencies[key] = ""));
        Object.keys(rightEarFrequencies).forEach(key => (rightEarFrequencies[key] = ""));
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
    <TableBody>
        <TableBodyRow>
            <TableBodyCell>Left Ear</TableBodyCell>
            {#each Object.keys(leftEarFrequencies) as freq}
                <TableBodyCell>
                    <Input bind:value={leftEarFrequencies[freq]} />
                </TableBodyCell>
            {/each}
        </TableBodyRow>
        <TableBodyRow>
            <TableBodyCell>Right Ear</TableBodyCell>
            {#each Object.keys(rightEarFrequencies) as freq}
                <TableBodyCell>
                    <Input bind:value={rightEarFrequencies[freq]} />
                </TableBodyCell>
            {/each}
        </TableBodyRow>
    </TableBody>
  </Table>

<div class="form">
    <Button on:click={submitData} class="bg-light-bluegreen hover:bg-dark-bluegreen text-black" style="width:200px">Submit</Button>
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


