<script lang="ts">
    // TODO: export users and their statuses
    // TODO: make svelte store writables
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Checkbox, Modal, Button } from 'flowbite-svelte';
    import EditIcon from './EditIcon.svelte';
    import { createEventDispatcher } from 'svelte';
    import { error } from '@sveltejs/kit';

    import { Input, Label, Helper } from 'flowbite-svelte';
	import { invalidateAll } from '$app/navigation';

    import type { Admin } from './MyTypes.ts';

    export let admins: Array<Admin>;

    console.log("ADMINS:");
    console.log(admins);

    $: adminsMap = admins
        .map((row: Admin) => ({
            name: row.name,
            email: row.email,
            googleID: row.googleID,
            isOP: row.isOP,
            selected: false,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

    // use selectedAdmins to modify multiple user-selected admins
    let selectedAdmins: Array<Admin> = [];

    let selectedAdmin: Admin;

    $: selectedAdmins = adminsMap.filter((e) => e.selected == true);

    // TODO: add indicator showing that people cannot change their email after it has been set. They must switch to a different Google account

    let success = true;
    let errorMessage = "";
    let newName = "";

    function displayError(message: string) {
        errorMessage = message;
        success = false;
    }

    async function modifyAdminPermissions(admin: Admin): Promise<void> {
        const formData = new FormData();
        formData.append('adminID', admin.googleID);
        formData.append('isOp', (!admin.isOP).toString());

        const response = await fetch('/dashboard?/modifyAdminPermissions', {
            method: 'POST',
            body: formData,
        });

        try {
            const serverResponse = await response.json();
            console.log(response);

            const result = JSON.parse(JSON.parse(serverResponse.data)[0]);
    
            if (result["success"]) {
                success = true;
                await invalidateAll();
                adminsMap = adminsMap; // update the DOM
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

    async function modifyAdminName(admin: Admin): Promise<void> {
        const formData = new FormData();
        formData.append('adminID', admin.googleID);
        formData.append('newName', newName);

        const response = await fetch('/dashboard?/modifyAdminName', {
            method: 'POST',
            body: formData,
        });

        try {
            const serverResponse = await response.json();
            console.log(response);

            const result = JSON.parse(JSON.parse(serverResponse.data)[0]);
    
            if (result["success"]) {
                success = true;
                await invalidateAll();
                adminsMap = adminsMap; // update the DOM
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

    async function deleteSelectedUsers() {
        if (selectedAdmins.length === 0) {
            displayError("No users selected for deletion.");
            return;
        }

        // Get google IDs of admins to delete
        const adminIDsToDelete = selectedAdmins.map(admin => admin.googleID);

        // Prepare the request payload
        const formData = new FormData();
        formData.append('adminIDs', JSON.stringify(adminIDsToDelete));

        try {
            const response = await fetch('/dashboard?/deleteAdmins', {
                method: 'POST',
                body: formData,
            });

            const serverResponse = await response.json();
            console.log(response);

            const result = JSON.parse(JSON.parse(serverResponse.data)[0]);

            if (result["success"]) {
                // Remove deleted admins from local view
                success = true;
                await invalidateAll(); // Refresh the page or data
                adminsMap = adminsMap;
            } else {
                displayError(serverResponse.message || "Failed to delete selected users.");
            }
        } catch (error: any) {
            displayError("An error occurred while deleting users: " + error.message);
        }
    }
    
    function showAdminPermissionsModal(admin: Admin) {
        selectedAdmin = admin
        if (admin.isOP) adminFalseModal = true;
        else adminModal = true;
    }

    function showNameChangeModal(admin: Admin) {
        newName = admin.name;
        selectedAdmin = admin
        nameModal = true;
    }

    const disptatch = createEventDispatcher();

    let adminModal = false; // controls the appearance of the popup add admin confirmation window
    let adminFalseModal = false; // controls the appearance of the popup remove admin confirmation window
    let nameModal = false; // controls the appearance of the admin name change window
</script>

<Modal title="Change Admin Username" bind:open={nameModal} autoclose>
    <p>
        <span>Please provide an updated name for {selectedAdmin.name} ({selectedAdmin.email})</span>
        <br>
        <br>
        <Label for="name" class="mb-2">Full name</Label>
        <Input type="text" id="name" placeholder={selectedAdmin.name} bind:value={newName} required />
    </p>
    
    <svelte:fragment slot="footer">
        <!-- TODO: CHANGE THESE COLOURS -->
        <Button class="bg-blue-200 hover:bg-blue-300 text-black" on:click={() => modifyAdminName(selectedAdmin)}>Confirm</Button>
        <Button class="bg-red-200 hover:bg-red-300 text-black">Cancel</Button>
    </svelte:fragment>
</Modal>

<Modal title="Notice for Revoking Admin Permissions" bind:open={adminFalseModal} autoclose>
    <p>
        <span class="text-red-600">Are you sure you want to revoke the permissions of {selectedAdmin.name} ({selectedAdmin.email})?</span>
    </p>
    
    <svelte:fragment slot="footer">
        <!-- TODO: CHANGE THESE COLOURS -->
        <Button class="bg-blue-200 hover:bg-blue-300 text-black" on:click={() => modifyAdminPermissions(selectedAdmin)}>Yes</Button>
        <Button class="bg-red-200 hover:bg-red-300 text-black">No</Button>
    </svelte:fragment>
</Modal>

<Modal title="Notice for Granting Admin Permissions" bind:open={adminModal} autoclose>
    <p>
        <span>Giving a user admin status allows them to view and modify all employees in the system. Only do this if you know and trust this person.</span>
        <br>
        <br>
        <span class="text-red-600">Are you sure you want to make {selectedAdmin.name} ({selectedAdmin.email}) an admin?</span>
    </p>
    
    <svelte:fragment slot="footer">
        <!-- TODO: CHANGE THESE COLOURS -->
        <Button class="bg-blue-200 hover:bg-blue-300 text-black" on:click={() => modifyAdminPermissions(selectedAdmin)}>Yes</Button>
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
            <TableHeadCell>Is Admin</TableHeadCell>
            <TableHeadCell>
                <span class="sr-only">Edit</span>
            </TableHeadCell>
        </TableHead>
        <TableBody tableBodyClass="divide-y">
            {#each adminsMap as admin (admin.googleID)}
                <TableBodyRow>
                    <TableBodyCell class="!p-4">
                        <Checkbox on:click={() => admin.selected = !admin.selected}/>
                    </TableBodyCell>
                    <TableBodyCell>
                        {admin.name}
                        <EditIcon on:edit={() => showNameChangeModal(admin)} />
                    </TableBodyCell>
                    <TableBodyCell>
                        {admin.email}
                    </TableBodyCell>
                    <TableBodyCell>
                        {admin.googleID}
                    </TableBodyCell>
                    <TableBodyCell>
                        {admin.isOP}
                        <EditIcon on:edit={() => showAdminPermissionsModal(admin)} />
                    </TableBodyCell>
                    <TableBodyCell>
                        <a href="/tables" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Edit</a>
                    </TableBodyCell>
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
    <!-- ! FOR TESTING, REMOVE LATER -->
    {#each selectedAdmins as op}{op.name}.{/each}

    <!-- TODO: ADD OPTION TO DELETE SELECTED USERS -->
    <div>
        <button on:click={deleteSelectedUsers} class="bg-red-200 hover:bg-red-300 text-black">Delete selected users</button>
    </div>
    
</div>