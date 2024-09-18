import { redirect } from '@sveltejs/kit';
import { sql } from "@vercel/postgres";

const SESSION_COOKIE_NAME = 'session_id';

export async function handle({ event, resolve }) {
    const sessionId = event.cookies.get(SESSION_COOKIE_NAME);

    if (sessionId) {
        // Verify session ID
        const { rows } = await sql`SELECT * FROM sessions WHERE session_id = ${sessionId};`;
        if (rows.length === 0) {
            // Invalid session, clear the cookie and redirect to login
            event.cookies.delete(SESSION_COOKIE_NAME);
            return redirect(302, '/login');
        }
    } else if (event.url.pathname !== '/login') {
        // No session cookie and trying to access protected routes
        return redirect(302, '/login');
    }

    return resolve(event);
}
