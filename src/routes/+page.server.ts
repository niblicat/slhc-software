import { sql } from "@vercel/postgres";

export async function load({ locals }) {
  return {
    pets: await sql`SELECT * FROM Pets;`
  }
}

