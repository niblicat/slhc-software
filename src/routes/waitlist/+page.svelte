<svelte:head>
	<link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet"/>
    <link href="https://cdn.jsdelivr.net/npm/flowbite@2.5.1/dist/flowbite.min.css" rel="stylesheet" />

</svelte:head>

<script lang="ts"  src="../path/to/flowbite/dist/flowbite.min.js">
    import { Navbar, NavBrand, Avatar, Dropdown, DropdownItem, DropdownHeader, DropdownDivider } from 'flowbite-svelte';
    import CustomAvatar from '../customavatar.svelte';

    let name = "example name";
    let email = "example email";

</script>

<Navbar rounded color="form" class="flex justify-between items-center">
    <NavBrand href="/" class="flex-grow text-center">
        <span class="text-2xl font-semibold dark:text-white">SIUE SLHC Employee Hearing Panel</span>
    </NavBrand>
    <CustomAvatar name={name} email={email} />
</Navbar>

<h1>Please wait until an administrator verifies you.</h1>

<style>

</style>