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
        employees: employees,
        admins: admins
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
        const newName = formData.get('newName') as string;

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
    },
    deleteAdmins: async ({ request }) => {
        console.log("deleteAdmins");
        // Retrieve the admin IDs from the form data
        const formData = await request.formData();
        const adminIDs: string = JSON.parse(formData.get('adminIDs') as string) as string;

        try {
            // DELETE!!!!
            const result = await sql`
                DELETE FROM Administrator
                WHERE id = ANY(${adminIDs});
            `;

            // Check if any rows were deleted
            if (result.rowCount === 0) {
                return { success: false, message: 'No admins were deleted. Admin IDs might be incorrect.' };
            }

        } catch (error: any) {
            console.error('Failed to delete admins:', error.message);
            return { success: false, message: 'Failed to delete selected admins.' };
        }

        return JSON.stringify({
            success: true,
        });
    },

    addEmployee: async ({ request }) => {
        const formData = await request.formData();
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const email = formData.get('email') as string;
        const dateOfBirth = formData.get('dateOfBirth') as string;
        const isInactive = formData.get('isInactive') === 'true';
        const lastActive = isInactive ? formData.get('lastActive') as string : null;

        try {
          // Insert new employee into the database (adjust as needed for your DB schema)
          const result = await sql`
            INSERT INTO Employee (first_name, last_name, email, date_of_birth, last_active)
            VALUES (${firstName}, ${lastName}, ${email}, ${dateOfBirth}, ${lastActive});
          `;
    
          if (result.rowCount === 0) {
            return { success: false, message: 'Failed to add employee' };
          }
    
        } 
        catch (error: any) {
          console.log('Error adding employee:', error.message);
          return { success: false, message: 'Failed to add employee due to error' };
        }

        return JSON.stringify({
            success: true,
        });
    },

    addHearingData: async ({ request }) => {
        const formData = await request.formData();
        const user = formData.get('user') as string;
        const year = parseInt(formData.get('year') as string, 10);
        const leftEarFrequencies = JSON.parse(formData.get('leftEarFrequencies') as string);
        const rightEarFrequencies = JSON.parse(formData.get('rightEarFrequencies') as string);

        const validateFrequencies = (frequencies: Record<string, string | number>) =>
            Object.values(frequencies).every(value => !isNaN(parseInt(value as string, 10)));
    
        if (!validateFrequencies(leftEarFrequencies) || !validateFrequencies(rightEarFrequencies)) {
            throw new Error('Invalid frequency data');
        }

        try {
            // Fetch employee_id for the selected user
            const userIdQuery = await sql`SELECT employee_id FROM Employee WHERE CONCAT(first_name, ' ', last_name) = ${user};`;
            if (userIdQuery.rows.length === 0) {
                throw new Error("User not found");
            }

            const employeeId = userIdQuery.rows[0].employee_id;

            // Insert left ear data into Data table
            const leftEarDataResult = await sql`
                INSERT INTO Data (Hz_500, Hz_1000, Hz_2000, Hz_3000, Hz_4000, Hz_6000, Hz_8000)
                VALUES (${leftEarFrequencies.hz500}, ${leftEarFrequencies.hz1000}, ${leftEarFrequencies.hz2000}, 
                        ${leftEarFrequencies.hz3000}, ${leftEarFrequencies.hz4000}, ${leftEarFrequencies.hz6000}, ${leftEarFrequencies.hz8000})
                RETURNING data_id;
            `;

            const leftEarDataId = leftEarDataResult.rows[0].data_id;


            // Insert right ear data into Data table
            const rightEarDataResult = await sql`
                INSERT INTO Data (Hz_500, Hz_1000, Hz_2000, Hz_3000, Hz_4000, Hz_6000, Hz_8000)
                VALUES (${rightEarFrequencies.hz500}, ${rightEarFrequencies.hz1000}, ${rightEarFrequencies.hz2000}, 
                        ${rightEarFrequencies.hz3000}, ${rightEarFrequencies.hz4000}, ${rightEarFrequencies.hz6000}, ${rightEarFrequencies.hz8000})
                RETURNING data_id;
            `;

            const rightEarDataId = rightEarDataResult.rows[0].data_id;

            console.log(`Inserting into Has for Employee ID: ${employeeId}, Year: ${year}, Left Ear Data ID: ${leftEarDataId}, Right Ear Data ID: ${rightEarDataId}`);

            // Insert into Has table for right ear
            await sql`
                INSERT INTO Has (employee_id, data_id, year, ear)
                VALUES (${employeeId}, ${rightEarDataId}, ${year}, 'right');
            `;

            // Insert into Has table for left ear
            await sql`
                INSERT INTO Has (employee_id, data_id, year, ear)
                VALUES (${employeeId}, ${leftEarDataId}, ${year}, 'left');
            `;
        } 
        catch (error: any) {
            console.log("Error adding employee's hearing data:", error.message);
            return { success: false, message: "Failed to add employee's hearing data due to error" };
        }

        return JSON.stringify({
            success: true,
        });
    }
};
