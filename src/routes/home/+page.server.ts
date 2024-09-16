import { sql } from "@vercel/postgres";

export async function load({ locals }) {
    // Fetch the pets from the database
    const { rows } = await sql`SELECT * FROM Admin;`;

    // Return the rows as a serializable object
    return {
        users: rows
    };
}