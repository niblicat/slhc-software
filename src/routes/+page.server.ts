import { sql } from '@vercel/postgres'
import { page } from '$app/stores';
import { redirect } from '@sveltejs/kit'
import { addUserToAdminDatabase, checkAdminStatus, obtainLoginStatus, LoginStatus } from '$lib/utility';
import { AdminStatus } from '$lib/utility';;

export const load = async (event) => {
    const loginStatus = await obtainLoginStatus(event);

    switch (loginStatus) {
        case LoginStatus.HasPerms:
            console.log("User HAS perms");
            redirect(303, '/dashboard');
        default:
            return { loginStatus };
    }
}