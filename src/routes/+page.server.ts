import { sql } from '@vercel/postgres'
import { page } from '$app/stores';
import { redirect } from '@sveltejs/kit'
import type { Session } from '@auth/sveltekit';
import { addUserToAdminDatabase } from '$lib/utility';

export const load = async (event) => {
    const session = await event.locals.auth();

    if (session) {
        const adminStatus = await checkAdminStatus(session)
        switch (adminStatus) {
            case AdminStatus.HasPerms:
                console.log("User HAS perms");
                redirect(303, '/dashboard');
            case AdminStatus.NoPerms:
                console.log("User DOES NOT perms");
                break;
            case AdminStatus.NotListed:
                console.log("Not Listed");
                await addUserToAdminDatabase(session.user?.email)
                break;
        }
    }
}

enum AdminStatus {
    NotListed,
    NoPerms,
    HasPerms
}

async function checkAdminStatus(session: Session): Promise<AdminStatus> {
    console.log('Verifying if user is an administrator')

    try {
        if (!session) {
            throw new Error('No active session');
        }

        const userEmail = session.user?.email;

        const result = await sql`
            SELECT isop
            FROM administrator
            WHERE userstring = ${userEmail}
        `;

        if (result.rowCount == 0) {
            // They're not yet in the database, we need to add them
            return AdminStatus.NotListed
        }

        const isAdmin = result.rows.length > 0 && result.rows[0].isop === true;
        console.log("Query result:", result.rows);
        console.log("Admin status:", isAdmin);

        if (isAdmin) {
            return AdminStatus.HasPerms;
        }
        else {
            return AdminStatus.NoPerms;
        }
    } 
    catch (error) {
        console.error("Error verifying administrator status", error);
        return AdminStatus.NotListed;
    }
}