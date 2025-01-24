<script lang="ts">
    import { Avatar, Dropdown, DropdownItem, DropdownHeader, DropdownDivider } from 'flowbite-svelte';
    import type { UserSimple } from './MyTypes';
    import { signIn, signOut } from '@auth/sveltekit/client';
    
    interface Props {
        user: UserSimple;
    }

    let { user }: Props = $props();

    let avatar = $state("");
    $effect(() => {
        // Need to parameters at the end of user.avatar
        const avatarRaw = user.avatar;
        avatar = avatarRaw.replace(/=.*/, '');
    })

</script>


<div class="flex items-center md:order-2">
    <Avatar border id="avatar-menu" class="hover:border-blue-500 active:bg-gray-200 transition duration-150 ease-in-out cursor-pointer"
    src={avatar} />
</div>
<Dropdown placement="bottom" triggeredBy="#avatar-menu">
    <DropdownHeader>
        <span class="block text-sm">{user.name}</span>
        <span class="block truncate text-sm font-medium">{user.email}</span>
    </DropdownHeader>
    {#if user.loggedIn}
        <DropdownItem on:click={() => signOut()} class="hover:text-gray-700 hover:no-underline">Log Out</DropdownItem>
    {:else}
        <DropdownItem on:click={() => signIn("google")} class="hover:text-gray-700 hover:no-underline">Log In</DropdownItem>
    {/if}
</Dropdown>

<form id="logout-form" action="/signout" method="POST" style="display: none;"></form>