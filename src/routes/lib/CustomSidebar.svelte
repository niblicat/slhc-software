<script lang="ts">
    import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
    import { GridSolid, MailBoxSolid, UserSolid, ArrowRightToBracketOutline } from 'flowbite-svelte-icons';
    import { createEventDispatcher } from 'svelte';

    export let sidebarOpen;
    export let activeURLHash;

    const dispatch = createEventDispatcher();

    function sidebarToggleDispatch() {
        dispatch('toggle')
    }

    let activeClass = 'flex items-center p-2 text-base font-normal text-primary-900 bg-primary-200 dark:bg-primary-700 rounded-lg dark:text-white hover:bg-primary-100 dark:hover:bg-gray-700';
    let nonActiveClass = 'flex items-center p-2 text-base font-normal text-green-900 rounded-lg dark:text-white hover:bg-green-100 dark:hover:bg-green-700';
</script>

<!-- Overlay background for when sidebar is open-->
{#if sidebarOpen}
    <button class="fixed inset-0 bg-black opacity-50 z-40" on:click={sidebarToggleDispatch}></button>
{/if}

<!-- Sidebar -->
<div class={`fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out`}>
    <Sidebar {activeURLHash} {activeClass} {nonActiveClass} class="h-full">
        <!-- Content wrapper inside the sidebar with padding to push content down -->
        <SidebarWrapper class="h-full overflow-y-auto pt-16"> <!-- Add padding here -->
            TEST {activeURLHash}
            <SidebarGroup>
                <SidebarItem label="Admin" href="#admin">
                    <UserSolid class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                </SidebarItem>
                <SidebarItem label="Employees" href="#employees">
                    <GridSolid class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                </SidebarItem>
                <SidebarItem label="Mailings" href="#mailings">
                    <MailBoxSolid class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                </SidebarItem>
                <SidebarItem label="Insert Employees" href="#insert">
                    <ArrowRightToBracketOutline class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                </SidebarItem>
            </SidebarGroup>
        </SidebarWrapper>
    </Sidebar>
</div>