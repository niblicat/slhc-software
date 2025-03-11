<script lang="ts">
    import { Button, Card } from 'flowbite-svelte';
    import { EditOutline } from 'flowbite-svelte-icons';
    import type { Employee } from './MyTypes';
    import EmployeeChart from './EmployeeChart.svelte';

    // Props
    export let selectedYear: string = "No year selected";
    export let selectedEmployee: { name: string, data: Employee };
    export let selectedEmail: string = "No data selected";
    export let selectedDOB: string = "No data selected";
    export let selectedStatus: string = "No data selected";
    export let STSstatusLeft: string = "No data selected";
    export let STSstatusRight: string = "No data selected";
    export let hearingHistory: Array<{year: string, leftStatus: string, rightStatus: string}> = [];
    
    // Chart data props
    export let RightBaselineHearingData: Array<number> = [];
    export let RightNewHearingData: Array<number> = [];
    export let LeftBaselineHearingData: Array<number> = [];
    export let LeftNewHearingData: Array<number> = [];
    
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

<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- Employee Details Card (Left Column) -->
    <div>
        <div class="flex justify-center">
            <Card padding="sm" class="w-full max-w-xl">
                <div class="bg-primary-700 text-white py-2 px-3 text-center">
                    <div class="text-lg font-bold">Employee Details</div>
                </div>
                
                <table class="w-full border-collapse">
                    <tbody>
                        <tr class="border-b hover:bg-gray-100">
                            <td class="p-3 font-semibold">Name:</td>
                            <td class="p-3 flex items-center">
                                <span>{selectedEmployee.name}</span>
                                {#if selectedEmployee.data.employeeID !== "-1"} 
                                    <Button color="light" size="xs" class="ml-2" on:click={showNameChangeModal}>
                                        <EditOutline class="w-3 h-3" />
                                    </Button>
                                {/if}
                            </td>
                        </tr>
                        <tr class="border-b hover:bg-gray-100">
                            <td class="p-3 font-semibold">Email:</td>
                            <td class="p-3 flex items-center">
                                <span class="break-words overflow-hidden">{selectedEmail}</span>
                                {#if selectedEmployee.data.email !== "Undefined"} 
                                    <Button color="light" size="xs" class="ml-2" on:click={showEmailChangeModal}>
                                        <EditOutline class="w-3 h-3" />
                                    </Button>
                                {/if}
                            </td>
                        </tr>
                        <tr class="border-b hover:bg-gray-100">
                            <td class="p-3 font-semibold">Date of Birth:</td>
                            <td class="p-3 flex items-center">
                                <span class="break-words overflow-hidden">{selectedDOB}</span>
                                {#if selectedEmployee.data.dob !== "Undefined"} 
                                    <Button color="light" size="xs" class="ml-2" on:click={showDOBChangeModal}>
                                        <EditOutline class="w-3 h-3" />
                                    </Button>
                                {/if}
                            </td>
                        </tr>
                        <tr class="border-b hover:bg-gray-100">
                            <td class="p-3 font-semibold">Sex:</td>
                            <td class="p-3 flex items-center">
                                <span class="break-words overflow-hidden">{selectedEmployee.data.sex}</span>
                                {#if selectedEmployee.data.sex !== "Undefined"} 
                                    <Button color="light" size="xs" class="ml-2" on:click={showSexChangeModal}>
                                        <EditOutline class="w-3 h-3" />
                                    </Button>
                                {/if}
                            </td>
                        </tr>
                        <tr class="hover:bg-gray-100">
                            <td class="p-3 font-semibold">Employment Status:</td>
                            <td class="p-3 flex items-center">
                                <span class="break-words overflow-hidden">{selectedStatus}</span>
                                {#if selectedEmployee.data.employeeID !== "-1"} 
                                    <Button color="light" size="xs" class="ml-2" on:click={showActiveStatusChangeModal}>
                                        <EditOutline class="w-3 h-3" />
                                    </Button>
                                {/if}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Card>
        </div>
    </div>

    <!-- Right Column (Audiogram Section and Chart) -->
    <div class="flex flex-col gap-4">
        <!-- Audiogram Card -->
        <div class="flex justify-center">
            <Card padding="sm" class="w-full max-w-xl">
                <div class="bg-primary-700 text-white py-2 px-3 text-center">
                    <div class="text-lg font-bold">Audiogram for {selectedYear}</div>
                </div>
                
                <table class="w-full border-collapse">
                    <tbody>
                        <tr class="border-b hover:bg-gray-100">
                            <td class="p-3 font-semibold">Left Ear Status:</td>
                            <td class="p-3">{STSstatusLeft}</td>
                        </tr>
                        <tr class="hover:bg-gray-100">
                            <td class="p-3 font-semibold">Right Ear Status:</td>
                            <td class="p-3">{STSstatusRight}</td>
                        </tr>
                    </tbody>
                </table>
            </Card>
        </div>
        
        <!-- Chart below the audiogram table -->
        <div class="flex justify-center">
            <Card padding="sm" class="w-full max-w-xl">
                <EmployeeChart 
                    {RightBaselineHearingData}
                    {RightNewHearingData}
                    {LeftBaselineHearingData}
                    {LeftNewHearingData}
                    {selectedYear}
                />
            </Card>
        </div>

        <!-- Hearing history below the chart -->
        <div class="flex justify-center">
            <Card padding="sm" class="w-full max-w-xl">
                <div class="bg-primary-700 text-white py-2 px-3 text-center">
                    <div class="text-lg font-bold">Hearing History</div>
                </div>
                
                <table class="w-full border-collapse">
                    <tbody>
                        <tr class="border-b hover:bg-gray-100">
                            <td class="p-3 font-semibold">Year:</td>
                            <td class="p-3 font-semibold">Left Ear Status:</td>
                            <td class="p-3 font-semibold">Right Ear Status:</td>
                        </tr>
                        
                        {#if hearingHistory.length === 0}
                            <tr class="border-b hover:bg-gray-100">
                                <td colspan="3" class="p-3 text-center">No hearing history available</td>
                            </tr>
                        {:else}
                            {#each hearingHistory as record}
                                <tr class="border-b hover:bg-gray-100" class:font-bold={record.year === selectedYear}>
                                    <td class="p-3">{record.year}</td>
                                    <td class="p-3">{record.leftStatus}</td>
                                    <td class="p-3">{record.rightStatus}</td>
                                </tr>
                            {/each}
                        {/if}
                    </tbody>
                </table>
            </Card>
        </div>
    </div>
</div>