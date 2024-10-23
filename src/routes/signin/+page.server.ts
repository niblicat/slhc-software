import { signIn } from "$auth"
import type { Actions } from "./$types"
import type { PageServerLoad } from "./$types"
import { redirect } from '@sveltejs/kit';
import { sql } from '@vercel/postgres'; // For Admin table data

export const actions: Actions = {
    default: async (event) => {
        const session = await signIn(event); // SignIn using Google OAuth2
        const username = session?.user?.username; // Extracts the users username ( will be email )

        if (!username) {
            throw redirect(302, '/signin');
        }

        // Check if the email is in the Admin table
        const result = await sql `
            SELECT * FROM Admin WHERE username = ${username};
        `;

        // If email is not found, redirect to "unauthorized" page (right now I have it set to the landing page)
        if (result.rows.length === 0) {
            throw redirect(302, '/');
            console.log(`Unauthorized access attempt by: ${username}`);
        }

        // Store the user info in session and redirect to dashboard
        throw redirect(303, '/dashboard');
        console.log(`User ${username} successfully signed in and redirected to the dashboard.`);
    },

    login: async ({ request }) => {
        const data = await request.formData();
        const { rows } = await sql`
            INSERT INTO admin (username)
            VALUES (${data.get('username')})`

        let val = false;

        throw redirect(303, '/admin/${rows[0].slug}');
    
        return {
            invalidCred: val,
            csrfToken: val

        }
    }
};
