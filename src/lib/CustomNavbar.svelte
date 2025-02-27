<script lang="ts">
    import { Navbar, NavBrand } from 'flowbite-svelte';
    import { Button, Tooltip } from 'flowbite-svelte';
    import CustomAvatar from './CustomAvatar.svelte';
    import type { UserSimple } from './MyTypes';
    import { BarsOutline, CloseOutline } from 'flowbite-svelte-icons';
    import { Li } from "flowbite-svelte";
    import { InfoCircleSolid } from 'flowbite-svelte-icons';
    import { page } from '$app/state';

    let activeURLHash = $derived(page.url.hash);

    interface Props {
        hasSidebar?: any;
        sidebarOpen: any;
        user: UserSimple;
        toggle: any;
    }

    let { hasSidebar = false, sidebarOpen, user, toggle }: Props = $props();

    function sidebarToggleDispatch() {
        toggle();
    }
</script>

{#if hasSidebar}
    <Button color="primary" class="fixed top-2.5 left-5 z-50 w-8 h-10 cursor-pointer" on:click={sidebarToggleDispatch}>
        {#if sidebarOpen}
            <CloseOutline size="xl" />
        {:else}
            <BarsOutline size="xl" />
        {/if}
    </Button>
{/if}

<Navbar color="primary" class="fixed flex justify-between items-center h-16 z-30">
    <NavBrand href="/dashboard" class="w-full text-center cursor-pointer">
        <span class="m-auto relative inline-block overflow-hidden whitespace-nowrap text-3xl font-bold text-[clamp(0.75rem,_3vw,_2rem)]">
            SIUE SLHC Employee Hearing Panel
        </span>
    </NavBrand>
    <div class="absolute right-20 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 mr-3">
        {#if activeURLHash == "#admin"} <!--Admin Page Tooltip-->
            <InfoCircleSolid class="text-gray-500 cursor-pointer" />
            <Tooltip 
                placement='left-start' 
                style="z-index: 9999; max-width: 80vw; width: auto; overflow-y: auto">
                <Li>Grant admin access by clicking the edit icon in the "Is Admin" column.</Li>
                <Li>Set "True" for admin access, "False" to revoke it.</Li>
                <Li>Edit an admin's name by clicking the edit icon and updating their name.</Li>
                <Li>Delete an admin by selecting the checkbox in the left column and clicking "Delete."</Li>
                <Li>To delete all admins, click the top checkbox and select "Delete."</Li>
            </Tooltip>

        {:else if activeURLHash == "#employees"} <!--Employee Page Tooltip-->
            <InfoCircleSolid class="text-gray-500 cursor-pointer" />
            <Tooltip 
                placement='left-start' 
                style="z-index: 9999; max-width: 80vw; width: auto; overflow-y: auto">
                <Li>Select an employee and year from the dropdowns.</Li>
                <Li>Employee details appear on the left, and the graph on the right.</Li>
                <Li>Click the edit button to modify an item.</Li>
                <br>
                To add employees:
                <Li>Click the person icon next to the year dropdown.</Li>
                <Li>Enter the employee’s details and last employment date if applicable.</Li>
                <Li>Click "Submit" to add.</Li>
                <br>
                To add data:
                <Li>Select an employee.</Li>
                <Li>Click the plus icon to add data.</Li>
                <Li>Enter the year, validate, and then submit data.</Li>
                <Li>Input ear data (values: -10 to 90, or 'CNT').</Li>
                <Li>Click "Submit" to add.</Li>
                <br>
                To edit data:
                <Li>Select an employee and year, then click the pencil icon.</Li>
                <Li>Update and submit the changes.</Li>        
            </Tooltip>

        {:else if activeURLHash == "#mailings"} <!--Mailing Page Tooltip-->
            <InfoCircleSolid class="text-gray-500 cursor-pointer" />
            <Tooltip 
                placement='left-start' 
                style="z-index: 9999; max-width: 80vw; width: auto; overflow-y: auto">
                <Li>Employees are listed by Employee ID.</Li>
                <Li>Set your default email reader to <em>Outlook</em> before starting.</Li>
                <Li>Click "Create CSV" and "Download Template" buttons below the employee info.</Li>  
                <Li>Download the <em>employees.csv</em> file, remembering the location.</Li>
                <Li>Download the <em>SLHC Email Template</em> and open in Word. <b>Do not modify the template!</b></Li>
                <Li>In Word, go to the "Mailings" tab and click "Start Mail Merge."</Li>
                <Li>Choose "Letter" from the dropdown and close.</Li>
                <Li>Click "Select Recipients," choose "Use an Existing List," and open the <em>employees.csv</em> file.</Li>
                <Li>Optional: Edit the recipient list, or skip this step.</Li>
                <Li>Optional: Click "Preview Results" to check how the data appears in the template.</Li>
                <Li>Click "Finish & Merge," then "Merge to E-Mail." </Li>
                <Li>Choose <em>Email</em> for "To," set the subject (e.g., "Hearing Test Results")</Li>
                <Li>Then select <em>HTML Message</em> for "Send As."</Li>
            </Tooltip>
        {/if}
    </div>
    <CustomAvatar {user} />
</Navbar>