<script lang="ts">
    import { Avatar, Dropdown, DropdownItem, DropdownHeader, DropdownDivider } from 'flowbite-svelte';
    import type { UserSimple } from './MyTypes';
    import { signIn, signOut } from '@auth/sveltekit/client';
    
    interface Props {
        user: UserSimple;
    }

    let { user }: Props = $props();

</script>


<Avatar id="avatar-menu" class="cursor-pointer shadow-sm shadow-black z-50"
    src={user.avatar.replace(/=(.*)/, '')} size="md" />
<Dropdown placement="bottom-start" triggeredBy="#avatar-menu">
    <DropdownHeader>
        <span class="block text-sm">{user.name}</span>
        <span class="block truncate text-sm font-medium">{user.email}</span>
    </DropdownHeader>
    {#if user.loggedIn}
        <DropdownItem on:click={() => signOut()} class="text-red-700 hover:text-red-800 hover:no-underline cursor-pointer">
            Log Out
        </DropdownItem>
    {:else}
        <DropdownItem on:click={() => signIn("google")} class="text-primary-700 hover:text-primary-800 hover:no-underline cursor-pointer">
            Log In
        </DropdownItem>
    {/if}
</Dropdown>