import { sql } from '@vercel/postgres';
import { redirect } from '@sveltejs/kit';
import cookie from 'cookie';

const SESSION_COOKIE_NAME = 'session_id';

// make this work with google! //

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

        // Redirect the user to the login page
        throw redirect(303, '/signin');
    }
};
