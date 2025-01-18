import type { Session } from "@auth/sveltekit";
import type { RequestEvent } from "@sveltejs/kit"
import { sql } from "@vercel/postgres";

export enum AdminStatus {
    NotListed,
    NoPerms,
    HasPerms
}

export enum LoginStatus {
    NoPerms,
    HasPerms,
    NoSession,
    NoName,
    NoEmail
}

export function handleSearchRedirect(event: RequestEvent) {
    const redirectTo = event.url.pathname + event.url.search;
    return '/dashboard?redirectTo=${redirectTo}';
}

export async function addUserToAdminDatabase(userEmail: string, name: string): Promise<void> {
    try {
        await sql`
            INSERT INTO administrator (userstring, name, isop)
            VALUES (${userEmail}, ${name}, false)
        `;
        console.log(`User ${name} (${userEmail}) successfully added to the admin database with isOP set to false.`);
    } catch (error) {
        console.error("Error adding user to the admin database:", error);
    }
}

export async function checkAdminStatus(session: Session): Promise<AdminStatus> {
    console.log('Verifying if user is an administrator');

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
            return AdminStatus.NotListed;
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
