import { sql } from "@vercel/postgres";
import { redirect } from '@sveltejs/kit';
// import { VercelRequest, VercelResponse } from '@vercel/node';

/** @type {import('./$types').Actions} */
export const actions = {

    
    default: async ({ request }) => {
        const data = await request.formData();
        const username = data.get('username') as string;
        const password = data.get('password') as string;

        const { rows } = await sql`SELECT username FROM Admin WHERE username = ${username} AND password = ${password};`;


        if (rows.length == 1)
            redirect(302, '/home')
        else {
            return { invalidCred: true }
        }
    }
};