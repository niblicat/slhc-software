import { redirect } from '@sveltejs/kit';
import { sql } from '@vercel/postgres';
import type { Actions, PageServerLoad } from './$types';
import { json } from '@sveltejs/kit';

// Load function to get parent data and fetch users
export const load: PageServerLoad = async ({ parent }) => {
    const parentData = await parent();

    if (!parentData.loggedIn) {
        // throw redirect(302, '/');
    }

    const employee = await sql`SELECT * FROM Employee;`;
    const admins = await sql`SELECT * FROM Administrator;`;

    console.log("This has changed...");

    return {
        employees: employee.rows,
        admins: admins.rows
    };
};

// Actions for login and registration
export const actions: Actions = {
    login: async (event) => {
        // TODO: log the user in
    },
    register: async (event) => {
        // TODO: register the user
    },
    modifyAdminPermissions: async ({request}) => {
        const formData = await request.formData();
        const adminID = formData.get('adminID') as string;
        const isOp = formData.get('isOp') === 'true';

        try {
            const result = await sql`UPDATE Administrator SET isop = ${isOp} WHERE id=${adminID};`
            
            if (result.rowCount === 0) {
                return { success: false, message: 'No rows were updated. Admin ID might be incorrect.' };
            }

        } catch (error: any) {
            console.log(error.message);
            console.log('Failed to update admin permissions');
            return { success: false, message: 'Failed to update admin permissions' };
        }
        
        return JSON.stringify({
            success: true,
        });
    },
    modifyAdminName: async ({request}) => {
        const formData = await request.formData();
        const adminID = formData.get('adminID') as string;
        const newName = formData.get('newName');

        try {
            const result = await sql`UPDATE Administrator SET name = ${newName} WHERE id=${adminID};`
            
            if (result.rowCount === 0) {
                return { success: false, message: 'No rows were updated. Admin ID might be incorrect.' };
            }

        } catch (error: any) {
            console.log(error.message);
            console.log('Failed to update admin name');
            return { success: false, message: 'Failed to update admin name' };
        }

        return JSON.stringify({
            success: true,
        });
    }
};
