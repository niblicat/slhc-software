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
<div out:slide={{ axis: 'x', easing: backIn }} in:slide={{ axis: 'x' }} class="sidebar-wrapper h-full">
    {#if sidebarOpen}
        <Sidebar {activeURLHash} {activeClass} {nonActiveClass} class="h-full pointer-events-auto">
            <!-- Content wrapper inside the sidebar with padding to push content down -->
            <SidebarWrapper class="h-full overflow-y-auto pt-16"> <!-- Add padding here -->
                TEST {activeURLHash}
                <SidebarGroup>
                    <SidebarItem on:click={sidebarToggleDispatch} label="Operators" href="#operator">
                        <svelte:fragment slot="icon">
                            <UserSolid/>
                        </svelte:fragment>
                    </SidebarItem>
                    <SidebarItem on:click={sidebarToggleDispatch} label="Employees" href="#employees">
                        <svelte:fragment slot="icon">
                            <GridSolid/>
                        </svelte:fragment>
                    </SidebarItem>
                    <SidebarItem on:click={sidebarToggleDispatch} label="Mailings" href="#mailings">
                        <svelte:fragment slot="icon">
                            <MailBoxSolid/>
                        </svelte:fragment>
                    </SidebarItem>
                    <SidebarItem on:click={sidebarToggleDispatch} label="Insert Employees" href="#insert">
                        <svelte:fragment slot="icon">
                            <ArrowRightToBracketOutline/>
                        </svelte:fragment>
                    </SidebarItem>
                    <SidebarItem on:click={sidebarToggleDispatch} label="Insert Data" href="#data">
                        <svelte:fragment slot="icon">
                            <ArrowRightToBracketOutline/>
                        </svelte:fragment>
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
        position: absolute;
        pointer-events: none;
        z-index: 3;
    }
</style>