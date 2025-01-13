// // import { redirect } from "@sveltejs/kit";

// // export const load = async ({ parent, url }) => {
// //   const parentData = await parent();

// //   // Redirect to the landing page if not logged in and trying to access a restricted page
// //   if (!parentData.loggedIn && url.pathname !== '/') {
// //     throw redirect(302, "/");
// //   }
// // };
// export const load = async ({ locals }) => {
//     const session = await locals.getSession();
//     const loggedIn = !!session?.user;
  
//     return {
//       loggedIn,
//     };
//   };
import { sql } from '@vercel/postgres'

// Function to check if a user is an administrator
export async function checkAdminStatus(email: string) {
    console.log('Verifying if user is an administrator');

    try {
        // Query the administrators table to find a user with the specified email
        const result = await sql`
            SELECT userstring, isop 
            FROM administrators 
            WHERE userstring = ${email}
            LIMIT 1
        `;

        if (result.rows.length > 0) {
            const admin = result.rows[0];
            if (admin.isop) {
                console.log('User is an administrator and has isop set to true');
                return true; // Return true if the user is an admin and isop is true
            } else {
                console.log('User is an administrator, but isop is not true');
                return false;
            }
        } else {
            console.log('User is not in the administrators table');
            return false;
        }
    } catch (error) {
        console.error('Error verifying administrator status:', error);
        throw error;
    }
}