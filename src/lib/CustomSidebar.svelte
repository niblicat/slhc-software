<script lang="ts">
    import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
    import { GridSolid, MailBoxSolid, UserSolid, ArrowRightToBracketOutline, HomeSolid } from 'flowbite-svelte-icons';

    import { slide } from 'svelte/transition';
    import { backIn } from 'svelte/easing';
	import { clickOutside, tapOutside } from 'svelte-outside';

    let { sidebarOpen, activeUrl, toggle } = $props();

    let clickOutsideLock = false;
    const clickOutsideDelayMilliseconds = 500;

    $effect(() => {
        if (sidebarOpen) {
            clickOutsideLock = true;
            setTimeout(() => {
                clickOutsideLock = false;
            }, clickOutsideDelayMilliseconds);
        }
    })

    async function sidebarToggleDispatch() {
        toggle();
    }

    function clickedOutside() {
        if (sidebarOpen && !clickOutsideLock) toggle();
    }

    // TODO: Make it more obvious which button is active by changing CSS
    let activeClass = 'flex items-center p-2 text-base font-normal text-primary-900 bg-primary-200 dark:bg-primary-700 rounded-lg dark:text-white hover:bg-primary-100 dark:hover:bg-gray-700';
    let nonActiveClass = 'flex items-center p-2 text-base font-normal text-green-900 rounded-lg dark:text-white hover:bg-green-100 dark:hover:bg-green-700';
</script>

<!-- Sidebar -->
{#key sidebarOpen}
    <div out:slide={{ axis: 'x', easing: backIn }} in:slide={{ axis: 'x' }} 
        use:clickOutside={clickedOutside} use:tapOutside={clickedOutside}
        class="absolute pointer-events-none left-0 w-80 h-screen z-20">
        {#if sidebarOpen}
            <Sidebar {activeUrl} {activeClass} {nonActiveClass} class="pointer-events-auto h-full">
                <!-- Content wrapper inside the sidebar with padding to push content down -->
                <SidebarWrapper class="overflow-y-auto pt-20 h-full">
                    <SidebarGroup>
                        <SidebarItem on:click={sidebarToggleDispatch} label="Dashboard" href="">
                            <HomeSolid/>
                        </SidebarItem>
                        <SidebarItem on:click={sidebarToggleDispatch} label="Admins" href="#admin">
                            <UserSolid/>
                        </SidebarItem>
                        <SidebarItem on:click={sidebarToggleDispatch} label="Employees" href="#employees">
                            <GridSolid/>
                        </SidebarItem>
                        <SidebarItem on:click={sidebarToggleDispatch} label="Mailings" href="#mailings">
                            <MailBoxSolid/>
                        </SidebarItem>
                        <SidebarItem on:click={sidebarToggleDispatch} label="Insert Employees" href="#insert">
                            <ArrowRightToBracketOutline/>
                        </SidebarItem>
                        <SidebarItem on:click={sidebarToggleDispatch} label="Insert Data" href="#data">
                            <ArrowRightToBracketOutline/>
                        </SidebarItem>
                    </SidebarGroup>
                </SidebarWrapper>
            </Sidebar>
        {/if}
    </div>
{/key}