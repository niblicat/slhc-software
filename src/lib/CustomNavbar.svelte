<script lang="ts">
    import { Navbar, NavBrand } from 'flowbite-svelte';
    import { Button } from 'flowbite-svelte';
    import CustomAvatar from './CustomAvatar.svelte';
    import { PageCategory, type UserSimple } from './MyTypes';
    import { BarsOutline, CloseOutline } from 'flowbite-svelte-icons';
    import { page } from '$app/state';
	import InfoButton from './InfoButton.svelte';

    let activeURLHash = $derived(page.url.hash);

    interface Props {
        hasSidebar?: any;
        sidebarOpen: any;
        user: UserSimple;
        toggle?: any;
    }

    let { hasSidebar = false, sidebarOpen, user, toggle }: Props = $props();

    function sidebarToggleDispatch() {
        toggle();
    }

    let currentPageCategory = $derived.by(() => {
        switch (activeURLHash) {
            case "#":
            case "":
                return PageCategory.Home;
            case "#admin":
                return PageCategory.Admin;
            case "#employees":
                return PageCategory.Employee;
            case "#mailings":
                return PageCategory.Mailing;
            default:
                return PageCategory.Other;
        }
    })
</script>

<Navbar color="primary" class="fixed z-30" navContainerClass="flex flex-nowrap space-x-4 h-16">
    {#if hasSidebar}
        <Button color="primary" class="w-8 h-10 cursor-pointer !z-50" on:click={sidebarToggleDispatch}>
            {#if sidebarOpen}
                <CloseOutline size="xl" />
            {:else}
                <BarsOutline size="xl" />
            {/if}
        </Button>
    {/if}
    <NavBrand href="/dashboard" class="absolute left-1/2 transform -translate-x-1/2 cursor-pointer">
        <span class="whitespace-nowrap text-3xl font-bold text-[clamp(0.75rem,_3vw,_2rem)]">
            SLHC Employee Hearing Panel
        </span>
    </NavBrand>
    <div class="ml-auto flex items-center space-x-4">
        <InfoButton page={currentPageCategory} />
        <CustomAvatar {user} />
    </div>
</Navbar>