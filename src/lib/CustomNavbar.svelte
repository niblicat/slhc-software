<script lang="ts">
    import { Navbar, NavBrand } from 'flowbite-svelte';
    import { Button } from 'flowbite-svelte';

    import CustomAvatar from './CustomAvatar.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { UserSimple } from './MyTypes';

    const dispatch = createEventDispatcher();

    function sidebarToggleDispatch() {
        dispatch('toggle');
    }

    interface Props {
        hasSidebar: any;
        sidebarOpen: any;
        user: UserSimple;
    }

    let { hasSidebar, sidebarOpen, user }: Props = $props();
</script>
{#if hasSidebar}
    <Button class="fixed top-2.5 left-2.5 z-50 w-8 h-10 bg-light-blue" on:click={sidebarToggleDispatch}>
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
{/if}
<!-- Navbar -->
<Navbar color="form" class="fixed bg-light-bluegreen flex justify-between items-center h-16 z-40">
    <NavBrand href="/dashboard" class="flex-grow text-center">
        <span class="relative flex-1 text-3xl font-bold dark:text-white">SIUE SLHC Employee Hearing Panel</span>
    </NavBrand>
    <CustomAvatar {user} />
</Navbar>