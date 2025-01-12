

import { redirect } from '@sveltejs/kit';
import { sql } from '@vercel/postgres';
import type { Actions, PageServerLoad } from './$types';
import { json } from '@sveltejs/kit';
import type { Employee } from '$lib/MyTypes';
import type { Admin } from '$lib/MyTypes';

// Load function to get parent data and fetch users
export const load: PageServerLoad = async ({ parent }) => {
    const parentData = await parent();

    // ! This has not been implemented properly
    // if (!parentData.loggedIn) {
    //     // throw redirect(302, '/');
    // }

    const employee = await sql`SELECT * FROM Employee;`;
    const administrator = await sql`SELECT * FROM Administrator;`;

    console.log("This has changed...");

    const employees: Employee[] = employee.rows.map(row => ({
        employeeID: row.employeeID,
        firstName: row.first_name,
        lastName: row.last_name,
        email: row.email,
        dob: row.date_of_birth
    }));

    const admins: Admin[] = administrator.rows.map(row => ({
        name: row.name,
        email: row.email,
        googleID: row.id,
        isOP: row.isop,
        selected: false
    }));

    return {
        // session: session,
        users: users.rows
    }
}