import type { RequestEvent } from "@sveltejs/kit"
import { sql } from "@vercel/postgres";

export function handleSearchRedirect(event: RequestEvent) {
    const redirectTo = event.url.pathname + event.url.search
    return '/dashboard?redirectTo=${redirectTo}'
}

export async function addUserToAdminDatabase(userEmail: string | undefined): Promise<void> {
    if (!userEmail) {
        console.error("No email provided to add to the database");
        return;
    }

    try {
        await sql`
            INSERT INTO administrator (userstring, isop)
            VALUES (${userEmail}, false)
        `;
        console.log(`User ${userEmail} successfully added to the admin database with isOP set to false.`);
    } catch (error) {
        console.error("Error adding user to the admin database:", error);
    }
}
