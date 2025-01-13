// // import { redirect } from '@sveltejs/kit';
// // import { sql } from "@vercel/postgres";

// // export { handle } from "./auth"

// // const SESSION_COOKIE_NAME = 'session_id';

// // export async function handle({ event, resolve }) {
// //     const sessionId = event.cookies.get(SESSION_COOKIE_NAME);

// //     if (sessionId) {
// //         // Verify session ID
// //         const { rows } = await sql`SELECT * FROM sessions WHERE session_id = ${sessionId};`;
// //         if (rows.length === 0) {
// //             // Invalid session, clear the cookie and redirect to login
// //             event.cookies.delete(SESSION_COOKIE_NAME);
// //             return redirect(302, '/login');
// //         }
// //     } else if (event.url.pathname !== '/login') {
// //         // No session cookie and trying to access protected routes
// //         return redirect(302, '/login');
// //     }

// //     return resolve(event);
// // }

// import { SvelteKitAuth } from "@auth/sveltekit";
// // import { AUTH_SECRET } from "$env/static/private";
// import GoogleProvider from "@auth/core/providers/google";
// import { AUTH_SECRET, AUTH_GOOGLE_CLIENT_ID, AUTH_GOOGLE_SECRET } from "$env/static/private";
// // import { sequence } from "@sveltejs/kit/hooks"; // This can be used if we have other handlers that we want SvelteKit to run.

// const auth = SvelteKitAuth({
//   providers: [
//     GoogleProvider({
//         clientId: AUTH_GOOGLE_CLIENT_ID,
//         clientSecret: AUTH_GOOGLE_SECRET
//     })
//   ],
//   session: {
//     maxAge: 10, //864000,      // Session must be set to 10 days (60 * 60 * 24 * 10) 864,000 seconds
//     strategy: "jwt",
//   },

//   secret: AUTH_SECRET,
// });

// export const handle = auth.handle;

export { handle } from "./auth"
