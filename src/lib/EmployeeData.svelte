<script lang="ts">
    import { Button, Card } from 'flowbite-svelte';
    import { EditOutline } from 'flowbite-svelte-icons';
    import type { Employee } from './MyTypes';

    // Props
    export let selectedYear: string = "No year selected";
    export let selectedEmployee: { name: string, data: Employee };
    export let selectedEmail: string = "No data selected";
    export let selectedDOB: string = "No data selected";
    export let selectedStatus: string = "No data selected";
    export let STSstatusLeft: string = "No data selected";
    export let STSstatusRight: string = "No data selected";
    
    // Event dispatcher to handle edit buttons
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    function showNameChangeModal() {
        dispatch('editName', selectedEmployee.data);
    }
    
    function showEmailChangeModal() {
        dispatch('editEmail', selectedEmployee.data);
    }
    
    function showDOBChangeModal() {
        dispatch('editDOB', selectedEmployee.data);
    }
    
    function showSexChangeModal() {
        dispatch('editSex', selectedEmployee.data);
    }
    
    function showActiveStatusChangeModal() {
        dispatch('editStatus', selectedEmployee.data);
    }
</script>

<Card padding="sm" class="w-full max-w-xl w-128">
    <!-- Header with employee name and percentage -->
    <div class="flex justify-between items-center mb-4">
        <div class="flex items-center gap-2">
            <h3 class="text-xl font-bold">
                {selectedEmployee.name}
                {#if selectedEmployee.data.employeeID !== "-1"} 
                    <Button color="light" size="xs" class="ml-2" on:click={showNameChangeModal}>
                        <EditOutline class="w-3 h-3" />
                    </Button>
                {/if}
            </h3>
        </div>
    </div>

    <div class="bg-primary-700 text-white py-1 px-3 text-center">
        <div class="text-lg font-bold">{selectedYear}</div>
    </div>
    <!-- Employee info in table-like format -->
    <div class="border bg-gray-50">
        <div class="grid grid-cols-2 p-4 border-b hover:bg-gray-100">
            <div class="font-semibold">Email:</div>
            <div class="flex items-center">
                <span class="break-words overflow-hidden">{selectedEmail}</span>
                {#if selectedEmployee.data.email !== "Undefined"} 
                    <Button color="light" size="xs" class="ml-2" on:click={showEmailChangeModal}>
                        <EditOutline class="w-3 h-3" />
                    </Button>
                {/if}
            </div>
        </div>
        
        <div class="grid grid-cols-2 p-4 border-b hover:bg-gray-100">
            <div class="font-semibold">Date of Birth:</div>
            <div class="flex items-center">
                <span class="break-words overflow-hidden">{selectedDOB}</span>
                {#if selectedEmployee.data.dob !== "Undefined"} 
                    <Button color="light" size="xs" class="ml-2" on:click={showDOBChangeModal}>
                        <EditOutline class="w-3 h-3" />
                    </Button>
                {/if}
            </div>
        </div>
        
        <div class="grid grid-cols-2 p-4 border-b hover:bg-gray-100">
            <div class="font-semibold">Sex:</div>
            <div class="flex items-center">
                <span class="break-words overflow-hidden">{selectedEmployee.data.sex}</span>
                {#if selectedEmployee.data.sex !== "Undefined"} 
                    <Button color="light" size="xs" class="ml-2" on:click={showSexChangeModal}>
                        <EditOutline class="w-3 h-3" />
                    </Button>
                {/if}
            </div>
        </div>
        
        <div class="grid grid-cols-2 p-4 border-b hover:bg-gray-100">
            <div class="font-semibold">Employment Status:</div>
            <div class="flex items-center">
                <span class="break-words overflow-hidden">{selectedStatus}</span>
                {#if selectedEmployee.data.employeeID !== "-1"} 
                    <Button color="light" size="xs" class="ml-2" on:click={showActiveStatusChangeModal}>
                        <EditOutline class="w-3 h-3" />
                    </Button>
                {/if}
            </div>
        </div>
        
        <div class="grid grid-cols-2 p-4 border-b hover:bg-gray-100">
            <div class="font-semibold">STS Status Left:</div>
            <div>{STSstatusLeft}</div>
        </div>
        
        <div class="grid grid-cols-2 p-4 hover:bg-gray-100">
            <div class="font-semibold">STS Status Right:</div>
            <div>{STSstatusRight}</div>
        </div>
    </div>
</Card>