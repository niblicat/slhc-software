import { redirect } from '@sveltejs/kit';
import { sql } from "@vercel/postgres";
//import { POSTGRES_URL } from '$env/static/private';
import type { PageServerLoad } from './$types';

// const SESSION_COOKIE_NAME = 'session_id';

// export async function load({ request, cookies }) {
//     const sessionId = cookies.get(SESSION_COOKIE_NAME);

//     if (!sessionId) {
//         throw redirect(302, '/signin'); // Redirect to login if no session cookie
//     }

//     // Check if the session ID exists in the database
//     const { rows } = await sql`SELECT username FROM sessions WHERE session_id = ${sessionId};`;

//     if (rows.length === 0) {
//         throw redirect(302, '/signin'); // Redirect to login if session ID is invalid
//     }

//     // Fetch user data or other data for the home page
//     // Example: Fetch users from the database
//     const users = await sql`SELECT * FROM Admin;`;

//     return {
//         users: users.rows
//     };
// }

export const load: PageServerLoad = async (event) => {
    // const session = await event.locals.auth();
    // if (!session) {
    //     throw redirect(302, '/signin'); // Redirect to login if no session cookie
    // }
    
    const users = await sql`SELECT * FROM Admin;`;
    
    return {
        // session: session,
        users: users.rows
    }
}