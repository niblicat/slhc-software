<script lang="ts">
    import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
    import { GridSolid, MailBoxSolid, UserSolid, ArrowRightToBracketOutline } from 'flowbite-svelte-icons';
    import { createEventDispatcher } from 'svelte';

    import { slide } from 'svelte/transition';
    import { backIn } from 'svelte/easing';

    export let sidebarOpen;
    export let activeURLHash;

    const dispatch = createEventDispatcher();

    function sidebarToggleDispatch() {
        dispatch('toggle')
    }

    let activeClass = 'flex items-center p-2 text-base font-normal text-primary-900 bg-primary-200 dark:bg-primary-700 rounded-lg dark:text-white hover:bg-primary-100 dark:hover:bg-gray-700';
    let nonActiveClass = 'flex items-center p-2 text-base font-normal text-green-900 rounded-lg dark:text-white hover:bg-green-100 dark:hover:bg-green-700';
</script>

<!-- Sidebar -->
{#key sidebarOpen}
<div out:slide={{ axis: 'x', easing: backIn }} in:slide={{ axis: 'x' }} class="sidebar-wrapper">
    {#if sidebarOpen}
        <Sidebar {activeURLHash} {activeClass} {nonActiveClass} class="h-full pointer-events-auto">
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
    {/if}
</div>
{/key}

<style>
    .sidebar-wrapper {
        left: 0px;
        width: 300px;
        height: 100%;
        position: absolute;
        pointer-events: none;
        z-index: 3;
    }
</style>