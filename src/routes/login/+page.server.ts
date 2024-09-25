import { fail, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { sql } from "@vercel/postgres";
import { randomBytes } from 'crypto';

const SESSION_COOKIE_NAME = 'session_id';

export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const username = data.get('username') as string;
        const password = data.get('password') as string;

        // Check credentials
        const { rows } = await sql`SELECT username FROM Admin WHERE username = ${username} AND password = ${password};`;

        if (rows.length === 1) {
            // Generate and store session ID
            const sessionId = randomBytes(32).toString('hex');
            await sql`INSERT INTO sessions (session_id, username) VALUES (${sessionId}, ${username});`;

            // Set session cookie
            cookies.set(SESSION_COOKIE_NAME, sessionId, {
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
                secure: !dev, // Secure cookies in production
                maxAge: 60 ///////60 * 60 // 1 hour ////// 60 * 60 * 24 * 7 // one week
            });

            throw redirect(302, '/dashboard'); // Redirect to home
        } else {
            return fail(400, { invalidCred: true }); // Handle invalid credentials
        }
    }
};
