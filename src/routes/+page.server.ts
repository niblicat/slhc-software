// import { sql } from '@vercel/postgres'
// import { page } from '$app/stores';
// import { goto } from '$app/navigation';
// import { redirect } from '@sveltejs/kit'

// // Function to check if a user is an administrator
// export async function checkAdminStatus(email: string) {
//     console.log('Verifying if user is an administrator');

//     try {
//         // Query the administrators table to find a user with the specified email
//         const result = await sql`
//             SELECT isop 
//             FROM administrators 
//             WHERE userstring = ${email}
//         `;

//         const isAdmin = result.rows.length > 0 && result.rows[0].isop === true;
//         console.log('Query result:', result.rows);
//         console.log('Admin status:', isAdmin);

//         if ($page.data.session) {
//             goto('/dashboard')
//         }
//         return {
//             isAdmin
//         }
//     } catch (error) {
//         console.error('Error verifying administrator status:', error);
//         return { 
//             isAdmin: false 
//         }
//     }
// }

import { sql } from '@vercel/postgres'
import { page } from '$app/stores';
import { goto } from '$app/navigation';
import { redirect } from '@sveltejs/kit'

export const load = async (event) => {
    const session = await event.locals.auth()

    if (session) {
        const adminStatus = await checkAdminStatus(session)
        if (checkAdminStatus.isAdmin) {
            return
        }
    }
}

export async function checkAdminStatus(session) {
    console.log('Verifying if user is an administrator')

    try {
        if (!session) {
            throw new Error('No active session')
        }

        const userEmail = session.user?.email

        const result = await sql`
            SELECT isop
            FROM administrators
            WHERE userstring = ${userEmail}
        `

        const isAdmin = result.rows.length > 0 && result.rows[0].isop === true
        console.log("Query result:", result.rows)
        console.log("Admin status:", isAdmin)

        return {
            isAdmin
        }
    } catch (error) {
        console.error("Error verifying administrator status", error)
        return {
            isAdmin: false
        }
    }
}