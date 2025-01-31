<script lang="ts">
    import { onMount } from 'svelte';
    import type { Employee } from '$lib/MyTypes';

    let employees: Employee[] = [];
    let isLoading = false;

    onMount(async () => {
        // Fetch employees data when component mounts
        const response = await fetch('?/load', {
            method: 'GET'
        });
        const data = await response.json();
        employees = data.employees;
    });

    function convertToCSV(data: Employee[]): string {
        // CSV header
        const headers = ['Employee ID', 'First Name', 'Last Name', 'Email', 'Date of Birth'];
        
        // Convert employee data to CSV rows
        const rows = data.map(employee => [
            employee.employeeID,
            employee.firstName,
            employee.lastName,
            employee.email,
            new Date(employee.dob).toLocaleDateString()
        ]);
        
        // Combine headers and rows
        return [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');
    }

    function downloadCSV() {
        isLoading = true;
        try {
            const csvContent = convertToCSV(employees);
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            
            // Create a URL for the Blob
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `employee_data_${new Date().toISOString().split('T')[0]}.csv`);
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading CSV:', error);
        } finally {
            isLoading = false;
        }
    }
</script>

<div class="container mx-auto p-4">
    <div class="bg-white rounded-lg shadow-md p-6">
        <div class="mb-6">
            <h2 class="text-2xl font-semibold text-gray-800">Employee Mailing List</h2>
        </div>
        
        <div class="space-y-4">
            <div class="flex justify-between items-center">
                <p class="text-sm text-gray-600">
                    Total Employees: {employees.length}
                </p>
                <button 
                    on:click={downloadCSV} 
                    disabled={isLoading || employees.length === 0}
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {#if isLoading}
                        Exporting...
                    {:else}
                        Export to CSV
                    {/if}
                </button>
            </div>
            
            <div class="overflow-x-auto">
                <table class="w-full border-collapse">
                    <thead>
                        <tr class="border-b border-gray-200">
                            <th class="p-2 text-left font-semibold text-gray-700">Name</th>
                            <th class="p-2 text-left font-semibold text-gray-700">Email</th>
                            <th class="p-2 text-left font-semibold text-gray-700">Date of Birth</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each employees as employee}
                            <tr class="border-b border-gray-200 hover:bg-gray-50">
                                <td class="p-2 text-gray-800">{employee.firstName} {employee.lastName}</td>
                                <td class="p-2 text-gray-800">{employee.email}</td>
                                <td class="p-2 text-gray-800">{new Date(employee.dob).toLocaleDateString()}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>