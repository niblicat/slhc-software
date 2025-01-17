<script lang="ts">
    // TODO: export users and their statuses
    // TODO: make svelte store writables
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Checkbox, Modal, Button, Tooltip } from 'flowbite-svelte';
    import EditIcon from './EditIcon.svelte';
    import { createEventDispatcher } from 'svelte';

    import { Input, Label, Helper } from 'flowbite-svelte';
	import { invalidateAll } from '$app/navigation';

    import type { Admin, AdminSelectable } from './MyTypes.ts';
	import { InfoCircleOutline } from 'flowbite-svelte-icons';

    export let admins: Array<Admin>;

    // console.log("ADMINS:");
    // console.log(admins);

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

    function showAdminDeletionModal() {
        deleteModal = true;
    }

    let doSelectAll = true;

    function toggleSelect(admin: AdminSelectable) { 
        alert(JSON.stringify(admin));
        adminsMap = adminsMap.map((item) =>
            item.googleID === admin.googleID
                ? { ...item, selected: !item.selected }
                : item
        );
        doSelectAll = true;
    }

    function massSelect() {
        adminsMap = adminsMap.map((admin) => ({
            ...admin,
            selected: doSelectAll,
        }));
        doSelectAll = !doSelectAll;
    }

    // const disptatch = createEventDispatcher();

    let adminModal = false; // controls the appearance of the popup add admin confirmation window
    let deleteModal = false; // controls the appearance of the popup delete admin confirmation window
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

<Modal title="Notice for Deleting Admins" bind:open={deleteModal} autoclose>
    <p>
        <span>The following users will be removed from the database and will no longer have permissions to access the SLHC Employee Hearing Panel.</span>
        {#each selectedAdmins as admin}
            <p>{admin.name} ({admin.email})</p>
        {/each}
        <br>
        <span class="text-red-600">Are you sure you want to remove these admins?</span>
    </p>
    
    <svelte:fragment slot="footer">
        <!-- TODO: CHANGE THESE COLOURS -->
        <Button class="bg-blue-200 hover:bg-blue-300 text-black" on:click={() => deleteSelectedUsers()}>Yes</Button>
        <Button class="bg-red-200 hover:bg-red-300 text-black">No</Button>
    </svelte:fragment>
</Modal>

<!-- figure out if this should be main -->
<div class="flex-column justify-center mx-4">
    
    <Table hoverable={true} class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <caption class="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
            Admin Approval
            <p class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">Modify the priviledges of anyone who has attempted to sign in.</p>
            {#if !success}
            <p class="mt-1 text-sm font-normal text-red-600 dark:text-red-300">{errorMessage}</p>
            {/if}
          </caption>
        <TableHead>
            <TableHeadCell class="!p-4">
              <Checkbox on:click={() => massSelect()} checked={!doSelectAll}/>
            </TableHeadCell>
            <TableHeadCell >Name</TableHeadCell>
            <TableHeadCell>Email</TableHeadCell>
            <TableHeadCell>Google ID</TableHeadCell>
            <TableHeadCell>Is Admin</TableHeadCell>
        </TableHead>
        <TableBody tableBodyClass="divide-y">
            {#each adminsMap as admin (admin.googleID)}
                <TableBodyRow>
                    <TableBodyCell class="!p-4">
                        <Checkbox on:click={() => toggleSelect(admin)} checked={admin.selected}/>
                    </TableBodyCell>
                    <TableBodyCell>
                        {admin.name}
                        <EditIcon on:edit={() => showNameChangeModal(admin)}/>
                    </TableBodyCell>
                    <TableBodyCell>
                        <span style="display: inline-flex; align-items: center; gap: 0.5rem;">
                            {admin.email}
                            <InfoCircleOutline id="email{admin.googleID}" />
                        </span>
                        <Tooltip triggeredBy="#email{admin.googleID}">Emails cannot be changed. Instead, use a different Google account and add permissions to the new account</Tooltip>
                    </TableBodyCell>
                    
                    <TableBodyCell>
                        {admin.googleID}
                    </TableBodyCell>
                    <TableBodyCell>
                        {admin.isOP}
                        <EditIcon on:edit={() => showAdminPermissionsModal(admin)}/>
                    </TableBodyCell>
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>

    <br>

    <!-- TODO: ADD OPTION TO DELETE SELECTED USERS -->
    {#if selectedAdmins.length > 0}
        <div>
            <Button color="red" on:click={showAdminDeletionModal} class="bg-red-200 hover:bg-red-300 text-black">Delete selected users</Button>
        </div>
    {/if}
</div>