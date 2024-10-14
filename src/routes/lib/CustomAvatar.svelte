<script lang="ts">
    import { Navbar, NavBrand, Avatar, Dropdown, DropdownItem, DropdownHeader, DropdownDivider } from 'flowbite-svelte';
    import { sql } from '@vercel/postgres';
    import { redirect } from '@sveltejs/kit';
    import cookie from 'cookie';
    
    export let name = "Name Missing";
    export let email = "null@example.com";

    const SESSION_COOKIE_NAME = 'session_id';

    export const actions = {
        default: async ({ cookies }) => {
            // Get session ID from the cookie
            const sessionId = cookies.get(SESSION_COOKIE_NAME);

            // If there is a session, delete it from the database
            if (sessionId) {
                await sql`DELETE FROM sessions WHERE session_id = ${sessionId};`;
            }

            // Clear the cookie by setting its maxAge to 0
            cookies.set(SESSION_COOKIE_NAME, '', {
                path: '/',
                maxAge: 0
            });

            // Redirect the user to the signin page
            throw redirect(303, '/signin');
        }
    };

    
    async function LogOut() { // actual signout page needs to work with google still
        // Clear session on the server side using a fetch request
        await fetch('/signout', {
            method: 'POST',
            credentials: 'same-origin',
        });

        const form = document.getElementById('logout-form') as HTMLFormElement;
        form?.submit();
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

<form id="logout-form" action="/signout" method="POST" style="display: none;"></form>