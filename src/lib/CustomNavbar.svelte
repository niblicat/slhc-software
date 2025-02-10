<script lang="ts">
    import { Navbar, NavBrand } from 'flowbite-svelte';
    import { Button } from 'flowbite-svelte';

    import CustomAvatar from './CustomAvatar.svelte';
    import type { UserSimple } from './MyTypes';
	import { BarsOutline, CloseOutline } from 'flowbite-svelte-icons';

    interface Props {
        hasSidebar: any;
        sidebarOpen: any;
        user: UserSimple;
        toggle: any;
    }

    let { hasSidebar, sidebarOpen, user, toggle }: Props = $props();

    function sidebarToggleDispatch() {
        toggle();
    }

</script>

{#if hasSidebar}
    <Button color="primary" class="fixed top-2.5 left-2.5 z-50 w-8 h-10" on:click={sidebarToggleDispatch}>
        {#if sidebarOpen}
            <CloseOutline size="xl" color="red" />
        {:else}
            <BarsOutline size="xl" />
        {/if}
    </Button>
{/if}

<Navbar color="primary" class="fixed flex justify-between items-center h-16 z-30">
    <NavBrand href="/dashboard" class="flex-grow text-center">
        <span class="relative flex-1 text-3xl font-bold">SIUE SLHC Employee Hearing Panel</span>
    </NavBrand>
    <CustomAvatar {user} />
</Navbar>