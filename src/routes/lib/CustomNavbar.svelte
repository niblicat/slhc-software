<script lang="ts">
    import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Avatar, Dropdown, DropdownItem, DropdownHeader, DropdownDivider } from 'flowbite-svelte';
    import { Button } from 'flowbite-svelte';

    import CustomAvatar from './CustomAvatar.svelte';
	import { createEventDispatcher } from 'svelte';


    const dispatch = createEventDispatcher();

    function sidebarToggleDispatch() {
        dispatch('toggle');
    }

    export let hasSidebar;
    export let sidebarOpen;
    export let name;
    export let email;
</script>

<!-- Navbar -->
<Navbar rounded color="form" class="flex justify-between items-center">
    {#if hasSidebar}
        <div class="fixed top-4 left-4 z-50">
            <Button class="relative w-8 h-10" on:click={sidebarToggleDispatch}>
                {#if sidebarOpen}
                    <!-- X icon when sidebar is open -->
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="absolute inset-0 w-full h-full">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                {:else}
                    <!-- Hamburger icon using SVG -->
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="absolute inset-0 w-full h-full">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                {/if}
            </Button>
        </div>
    {/if}
    <NavBrand href="/" class="flex-grow text-center">
        <span class="text-2xl font-semibold dark:text-white">SIUE SLHC Employee Hearing Panel</span>
    </NavBrand>
    <CustomAvatar name={name} email={email} />
</Navbar>