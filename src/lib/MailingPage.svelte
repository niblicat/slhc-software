<script lang="ts">
    import { Button } from "flowbite-svelte";
	import { onMount } from "svelte";
    import type { Employee } from '$lib/MyTypes';
    const zipPath = "/Letters.zip";

    let csvFile = null;
    let wordTemplate = null;
    let employees: Employee[] = [];

    const fetchEmployees = async () => {
        const response = await fetch("/employees");
        employees = await response.json();
    };

    const exportEmployeesCSV = () => {
        const header = ["first_name", "last_name", "email"];
        const rows = employees.map(emp => `${emp.firstName}, ${emp.lastName}, ${emp.email}`);
        const csvContent = "data:text/csv;charset=utf-8," + [header.join(","), ...rows].join("\n")

        // Encode the CSV content
        const encodeUri = encodeURI(csvContent);

        // Create a temporary link to trigger the download
        const link = document.createElement("a");
        link.setAttribute("href", encodeUri);
        link.setAttribute("download", "employees.csv");

        // Append the link to the body, trigger the click event, and then remove it
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Fetch the current employee data
    onMount(fetchEmployees);

    const handleUpload = () => {
        if (wordTemplate) {
            console.log("CSV File:", csvFile);;
            console.log("Word Template:", wordTemplate);
            // Backend merge logic goes here
        } else {
            alert("Please upload files.");
        }
    };


</script>

<seciton>
    <p class="mb-4">Click the button below to download all employee data as a CSV file.</p>
    <Button on:click={exportEmployeesCSV} class="bg-light-bluegreen hover:bg-dark-bluegreen text-black text-base flex justify-between items-center" style="width:300px">
        Export Employee Data
    </Button>
    <a href={zipPath} download="Letters.zip">
        <Button class="bg-light-bluegreen hover:bg-dark-bluegreen text-black text-base flex justify-between items-center" style="width:300px">
            Download Templates
        </Button>
    </a>
    <div class="mb-4">
        <label for="csv" class="block font-medium">Upload CSV:</label>
        <input type="file" id="csv" accept=".csv" on:change={(e) => csvFile = e.target.files[0]} />
    </div>
    <div class="mb-4">
        <label for="word" class="block font-medium">Upload Word Template:</label>
        <input type="file" id="word" accept=".docx" on:change={(e) => wordTemplate = e.target.files[0]} />
    </div>
    <button on:click={handleUpload} class="bg-light-bluegreen hover:bg-dark-bluegreen px-4 py-2 text-white rounded">
        Submit Files
    </button>
</seciton>
