<script lang="ts">
    import { Navbar, NavBrand, Avatar, Dropdown, DropdownItem, DropdownHeader, DropdownDivider } from 'flowbite-svelte';
    
    export let name = "Name Missing";
    export let email = "null@example.com";

    
    function LogOut() {
        // TODO: Implement logout functionality
    }
</script>


<div class="flex items-center md:order-2">
    <Avatar border id="avatar-menu" class="hover:border-blue-500 active:bg-gray-200 transition duration-150 ease-in-out cursor-pointer" />
</div>
<Dropdown placement="bottom" triggeredBy="#avatar-menu">
    <DropdownHeader>
        <span class="block text-sm">{name}</span>
        <span class="block truncate text-sm font-medium">{email}</span>
    </DropdownHeader>
    <DropdownItem>Account Settings</DropdownItem>
    <DropdownDivider />
    <DropdownItem on:click={LogOut}><p class="hover:text-gray-700 hover:no-underline">Log Out</p></DropdownItem>
</Dropdown>