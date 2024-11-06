<script lang="ts">
    // TODO: export users and their statuses
    // TODO: make svelte store writables
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Checkbox, Modal, Button } from 'flowbite-svelte';
    import EditIcon from './EditIcon.svelte';
	import { createEventDispatcher } from 'svelte';
	import { error } from '@sveltejs/kit';

    type Operator = {
        name: string,
        email: string,
        googleID: string,
        isOP: boolean
        selected: boolean
    };

    let operators: Array<Operator> = [
        {name: "e", email: "e2", googleID: "e3", isOP: true, selected: false},
        {name: "fabian", email: "fabian@2", googleID: "fabiangoogle", isOP: true, selected: false},
        {name: "rosie", email: "rosie@2", googleID: "rosiegoogle", isOP: false, selected: false},
        {name: "sage", email: "sage@2", googleID: "sagegoogle", isOP: true, selected: false},
    ]

    // use selectedOperators to modify multiple user-selected operators
    let selectedOperators: Array<Operator> = [];

    let selectedOperator: Operator;

    $: selectedOperators = operators.filter((e) => e.selected == true);

    // TODO: add indicator showing that people cannot change their email after it has been set. They must switch to a different Google account

    let success = true;
    let errorMessage = "";

    function displayError(message: string) {
        errorMessage = message;
        success = false;
    }

    async function modifyOperatorPermissions(operator: Operator): Promise<void> {
        const formData = new FormData();
        formData.append('operatorID', operator.googleID);
        formData.append('isOp', operator.isOP.toString());

        const response = await fetch('/dashboard', {
            method: 'POST',
            body: formData,
        });

        try {
            const result = await response.json();
    
            if (result.success) {
                success = true;
                let id = operator.googleID;
                operator.isOP = !operator.isOP;
                operators = operators; // update the DOM
            }
            else {
                displayError(result.message);
            }
        }
        catch (error: any) {
            let errorMessage = error.message;
            displayError(errorMessage);
        }
    }

    function showOperatorPermissionsModal(operator: Operator) {
        selectedOperator = operator
        operatorModel = true;
    }

    const disptatch = createEventDispatcher();

    let operatorModel = false; // controls the appearance of the popup operator confirmation window
</script>

<Modal title="Notice for Granting Operator Permissions" bind:open={operatorModel} autoclose>
    <p>

        <span>Giving a user operator status allows them to view and modify all employees in the system. Only do this if you know and trust this person.</span>
        <br>
        <br>
        <span class="text-red-600">Are you sure you want to make {selectedOperator.name} ({selectedOperator.email}) an operator?</span>
    </p>
    
    <svelte:fragment slot="footer">
        <!-- TODO: CHANGE THESE COLOURS -->
        <Button class="bg-blue-200 hover:bg-blue-300 text-black" on:click={() => modifyOperatorPermissions(selectedOperator)}>Yes</Button>
        <Button class="bg-red-200 hover:bg-red-300 text-black">No</Button>
    </svelte:fragment>
</Modal>

<!-- figure out if this should be main -->
<div class="h-screen flex-column justify-center">
    {#if !success}
        <span class="text-red-600">{errorMessage}</span>
    {/if}
    <Table hoverable={true}>
        <TableHead>
            <TableHeadCell class="!p-4">
              <Checkbox />
            </TableHeadCell>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Email</TableHeadCell>
            <TableHeadCell>Google ID</TableHeadCell>
            <TableHeadCell>Is Operator</TableHeadCell>
            <TableHeadCell>
                <span class="sr-only">Edit</span>
            </TableHeadCell>
        </TableHead>
        <TableBody tableBodyClass="divide-y">
            {#each operators as operator}
                <TableBodyRow>
                    <TableBodyCell class="!p-4">
                        <Checkbox bind:checked={operator.selected} />
                    </TableBodyCell>
                    <TableBodyCell>
                        {operator.name}
                        <EditIcon on:click />
                    </TableBodyCell>
                    <TableBodyCell>
                        {operator.email}
                    </TableBodyCell>
                    <TableBodyCell>
                        {operator.googleID}
                    </TableBodyCell>
                    <TableBodyCell>
                        {operator.isOP} <!-- is not changing -->
                        <EditIcon on:edit={() => showOperatorPermissionsModal(operator)} />
                    </TableBodyCell>
                    <TableBodyCell>
                        <a href="/tables" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Edit</a>
                    </TableBodyCell>
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
    {#each selectedOperators as op}{op.name}.{/each}
    
</div>