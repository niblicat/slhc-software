import { redirect } from '@sveltejs/kit';
import { sql } from '@vercel/postgres';
import type { Actions, PageServerLoad } from './$types';
import { json } from '@sveltejs/kit';
import type { Employee } from '$lib/MyTypes';
import type { Admin } from '$lib/MyTypes';
import { getAdminsFromDatabase, getEmployeesFromDatabase, turnAwayNonAdmins } from '$lib/utility';
import { UserHearingScreeningHistory, HearingScreening, HearingDataOneEar, PersonSex } from "$lib/interpret";

export const load: PageServerLoad = async ( event ) => {
    await turnAwayNonAdmins(event);

    const employees = await getEmployeesFromDatabase();
    const admins = await getAdminsFromDatabase();

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
            Object.values(frequencies).every(value => 
                value === null || 
                value === "CNT" || 
                (!isNaN(parseInt(value as string, 10)) && parseInt(value as string, 10) >= -10 && parseInt(value as string, 10) <= 90)
            );
        
        if (!validateFrequencies(leftEarFrequencies) || !validateFrequencies(rightEarFrequencies)) {
            throw new Error('Invalid frequency data');
        }

        try {
            // Fetch employee_id for the selected user //this will be gone when merged so ignore this
            const userIdQuery = await sql`SELECT employee_id FROM Employee WHERE CONCAT(first_name, ' ', last_name) = ${user};`;
            if (userIdQuery.rows.length === 0) {
                throw new Error("User not found");
            }

            const employeeId = userIdQuery.rows[0].employee_id;

            // Fetch employee details
            const employeeQuery = await sql`
                SELECT last_active FROM employee 
                WHERE employee_id = ${employeeId};
            `;
            if (employeeQuery.rows.length === 0) {
                throw new Error("User not found");
            }

            const lastActive = employeeQuery.rows[0].last_active; // Can be NULL if still active
            const currentYear = new Date().getFullYear();

            // **Validation 1: Ensure the year is within employment period**
            if (lastActive === null) {
                // Employee is still active
                if (year > currentYear || year < 1957) {
                    throw new Error("Cannot add hearing data for invalid year range.");
                }
            } else {
                // Employee is inactive
                const lastActiveYear = new Date(lastActive).getFullYear();
                if (year > lastActiveYear || year < 1957) {
                    throw new Error(`Cannot add hearing data after employment ended in ${lastActiveYear}.`);
                }
            }

            // **Validation 2: Ensure only one set of hearing data per year**
            const existingDataCheck = await sql`
                SELECT 1 FROM Has 
                WHERE employee_id = ${employeeId} AND year = ${year}
                LIMIT 1;
            `;

            if (existingDataCheck.rows.length > 0) {
                throw new Error(`Hearing data for the year ${year} already exists for this employee.`);
            }

            // **Transform frequencies for insertion**
            const transformFrequencies = (frequencies: Record<string, string | number>) => {
                return Object.fromEntries(
                    Object.entries(frequencies).map(([key, value]) => [
                        key,
                        value === "CNT" || value === null ? null : parseInt(value as string, 10),
                    ])
                );
            };            

            const leftEarFrequenciesTransformed = transformFrequencies(leftEarFrequencies);
            const rightEarFrequenciesTransformed = transformFrequencies(rightEarFrequencies);  
            
            //console.log("Left Ear Transformed:", leftEarFrequenciesTransformed);
            //console.log("Right Ear Transformed:", rightEarFrequenciesTransformed);

            // Insert left ear data into Data table
            const leftEarDataResult = await sql`
                INSERT INTO Data (Hz_500, Hz_1000, Hz_2000, Hz_3000, Hz_4000, Hz_6000, Hz_8000)
                VALUES (${leftEarFrequenciesTransformed.hz500}, ${leftEarFrequenciesTransformed.hz1000}, 
                        ${leftEarFrequenciesTransformed.hz2000}, ${leftEarFrequenciesTransformed.hz3000}, 
                        ${leftEarFrequenciesTransformed.hz4000}, ${leftEarFrequenciesTransformed.hz6000}, 
                        ${leftEarFrequenciesTransformed.hz8000})
                RETURNING data_id;
            `;

            const leftEarDataId = leftEarDataResult.rows[0].data_id;

            // Insert right ear data into Data table
            const rightEarDataResult = await sql`
                INSERT INTO Data (Hz_500, Hz_1000, Hz_2000, Hz_3000, Hz_4000, Hz_6000, Hz_8000)
                VALUES (${rightEarFrequenciesTransformed.hz500}, ${rightEarFrequenciesTransformed.hz1000}, 
                        ${rightEarFrequenciesTransformed.hz2000}, ${rightEarFrequenciesTransformed.hz3000}, 
                        ${rightEarFrequenciesTransformed.hz4000}, ${rightEarFrequenciesTransformed.hz6000}, 
                        ${rightEarFrequenciesTransformed.hz8000})
                RETURNING data_id;
            `;

            const rightEarDataId = rightEarDataResult.rows[0].data_id;

            //console.log(`Inserting into Has for Employee ID: ${employeeId}, Year: ${year}, Left Ear Data ID: ${leftEarDataId}, Right Ear Data ID: ${rightEarDataId}`);

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
    },
    fetchYears: async ({request}) => {
        const formData = await request.formData();
        const employeeID = formData.get('employee') as string;
    
        // Fetch employee_id for the selected user
        const employeeIdQuery = await sql`SELECT employee_id FROM Employee WHERE CONCAT(first_name, ' ', last_name) = ${employeeID};`;
        if (employeeIdQuery.rows.length === 0) {
            throw new Error("User not found");
        }
    
        const employeeId = employeeIdQuery.rows[0].employee_id;
    
        try {
            const yearsQuery = await sql`
                SELECT DISTINCT year
                FROM Has
                WHERE employee_id = ${employeeId}
                ORDER BY year;
            `;

            const availableYears = yearsQuery.rows.map(row => row.year);

            //console.log(`Employee: ${employeeID}, Employee ID: ${employeeId}, Years: ${availableYears}`);
            
            const yearsReturn = {
                success: true,
                years: availableYears
            }

            //console.log(JSON.stringify(yearsReturn));
 
            return JSON.stringify({
                success: true,
                years: availableYears
            });
        } 
        catch (error: any) {
            console.log(error.message);
            console.log('Failed to fetch employee years', error.message);
            return { success: false, message: 'Failed to fetch employee years' };
        }
    },
    fetchEmployeeInfo: async ({ request }) => {
        const formData = await request.formData();
        const employeeID = formData.get('employee') as string;
    
        // Fetch employee_id for the selected user
        const employeeIdQuery = await sql`SELECT employee_id FROM Employee WHERE CONCAT(first_name, ' ', last_name) = ${employeeID};`;
        if (employeeIdQuery.rows.length === 0) {
            throw new Error("User not found");
        }
    
        const employeeId = employeeIdQuery.rows[0].employee_id;
    
        //`Employee NAME: ${employeeID}, Employee: ${employeeId}`);
    
        try {
            // Query employee data
            const employeeQuery = await sql`
                SELECT email, date_of_birth, last_active, sex 
                FROM Employee 
                WHERE employee_id = ${employeeId};
            `;
    
            if (employeeQuery.rowCount === 0) {
                return json({ success: false, message: 'Employee not found' });
            }
    
            const employee = employeeQuery.rows[0];
            const employmentStatus = employee.last_active ? 'Inactive' : 'Active';
    
            //console.log(`Employee email: ${employee.email}, Employment Status: ${employmentStatus}, Employee: ${employeeID}, DOB: ${employee.date_of_birth}, sex: ${employee.sex}`);

            const employeeData = {
                email: employee.email,
                dob: employee.date_of_birth,
                employmentStatus,
                sex: employee.sex
            }

            const dataReturnTest = {
                success: true,
                employee: employeeData
            }

            //console.log(JSON.stringify(dataReturnTest));
    
            // Return only the necessary data in a plain object format
            return JSON.stringify({
                success: true,
                employee: employeeData
            });
        } 
        catch (error: any) {
            return json({ success: false, message: 'Failed to fetch employee data' });
        }
    }, 

    fetchHearingData: async ({ request }) => {
        const formData = await request.formData();
        const employeeID = formData.get('employeeID') as string;
        const year = formData.get('year') as string;
    
        console.log(`Employee ID: ${employeeID}, Year: ${year}`);
    
        try {
            // Get the oldest available year for the employee
            const baselineYearQuery = await sql`
                SELECT MIN(year) AS baseline_year
                FROM Has
                WHERE employee_id = ${employeeID};
            `;
            const baselineYear = baselineYearQuery.rows[0]?.baseline_year;
    
            // Fetch hearing data for the baseline year
            const baselineDataQuery = await sql`
                SELECT d.Hz_500, d.Hz_1000, d.Hz_2000, d.Hz_3000, d.Hz_4000, d.Hz_6000, d.Hz_8000, h.ear
                FROM Has h
                JOIN Data d ON h.data_id = d.data_id
                WHERE h.employee_id = ${employeeID} AND h.year = ${baselineYear};
            `;
    
            // Fetch hearing data for the new year
            const newDataQuery = await sql`
                SELECT d.Hz_500, d.Hz_1000, d.Hz_2000, d.Hz_3000, d.Hz_4000, d.Hz_6000, d.Hz_8000, h.ear
                FROM Has h
                JOIN Data d ON h.data_id = d.data_id
                WHERE h.employee_id = ${employeeID} AND h.year = ${year};
            `;
    
            const baselineData = {
                rightEar: baselineDataQuery.rows.filter(row => row.ear === 'right')[0] || null,
                leftEar: baselineDataQuery.rows.filter(row => row.ear === 'left')[0] || null,
            };
    
            const newData = {
                rightEar: newDataQuery.rows.filter(row => row.ear === 'right')[0] || null,
                leftEar: newDataQuery.rows.filter(row => row.ear === 'left')[0] || null,
            };

            const dataReturnTest = {
                success: true,
                hearingData: {
                    baselineYear,
                    newYear: year,
                    baselineData,
                    newData,
                },
            }

            //console.log(JSON.stringify(dataReturnTest));
    
            return JSON.stringify({
                success: true,
                hearingData: {
                    baselineYear,
                    newYear: year,
                    baselineData,
                    newData,
                },
            });
        } 
        catch (error: any) {
            console.log(error.message);
            return { success: false, message: 'Failed to fetch employee hearing data' };
        }
    },

    modifyEmployeeName: async ({request}) => {
        const formData = await request.formData();
        const employeeID = formData.get('employee') as string;
        const newFirstName = formData.get('newFirstName') as string;
        const newLastName = formData.get('newLastName') as string;
    
        // Fetch employee_id for the selected user
        const employeeIdQuery = await sql`SELECT employee_id FROM Employee WHERE CONCAT(first_name, ' ', last_name) = ${employeeID};`;
        if (employeeIdQuery.rows.length === 0) {
            throw new Error("User not found");
        }
    
        const employeeId = employeeIdQuery.rows[0].employee_id;

        //console.log(`Employee NAME: ${employeeID}, EmployeeID: ${employeeId}, First: ${newFirstName}, Last: ${newLastName}`);

        try {
            const resultFirst = await sql`UPDATE Employee SET first_name = ${newFirstName} WHERE employee_id=${employeeId};`
            const resultLast = await sql`UPDATE Employee SET last_name = ${newLastName} WHERE employee_id=${employeeId};`
            
            if (resultFirst.rowCount === 0) {
                return { success: false, message: 'First name was not updated. Employee ID might be incorrect.' };
            }
            if (resultLast.rowCount === 0) {
                return { success: false, message: 'Last name was not updated. Employee ID might be incorrect.' };
            }

        } catch (error: any) {
            console.log(error.message);
            console.log('Failed to update employee name');
            return { success: false, message: 'Failed to update employee name' };
        }

        return JSON.stringify({
            success: true,
        });
    },
    modifyEmployeeEmail: async ({request}) => {
        const formData = await request.formData();
        const employeeID = formData.get('employee') as string;
        const newEmail = formData.get('newEmail') as string;
    
        // Fetch employee_id for the selected user
        const employeeIdQuery = await sql`SELECT employee_id FROM Employee WHERE CONCAT(first_name, ' ', last_name) = ${employeeID};`;
        if (employeeIdQuery.rows.length === 0) {
            throw new Error("User not found");
        }
    
        const employeeId = employeeIdQuery.rows[0].employee_id;

        //console.log(`Employee NAME: ${employeeID}, EmployeeID: ${employeeId}, email: ${newEmail}`);

        try {
            const result = await sql`UPDATE Employee SET email = ${newEmail} WHERE employee_id=${employeeId};`
            
            if (result.rowCount === 0) {
                return { success: false, message: 'Email was not updated. Employee ID might be incorrect.' };
            }
        } catch (error: any) {
            console.log(error.message);
            console.log('Failed to update employee email');
            return { success: false, message: 'Failed to update employee email' };
        }

        return JSON.stringify({
            success: true,
        });
    },
    modifyEmployeeDOB: async ({request}) => {
        const formData = await request.formData();
        const employeeID = formData.get('employee') as string;
        const newDOB = formData.get('newDOB') as string;
    
        // Fetch employee_id for the selected user
        const employeeIdQuery = await sql`SELECT employee_id FROM Employee WHERE CONCAT(first_name, ' ', last_name) = ${employeeID};`;
        if (employeeIdQuery.rows.length === 0) {
            throw new Error("User not found");
        }
    
        const employeeId = employeeIdQuery.rows[0].employee_id;

        //console.log(`Employee NAME: ${employeeID}, EmployeeID: ${employeeId}, DOB: ${newDOB}`);

        try {
            const result = await sql`UPDATE Employee SET date_of_birth = ${newDOB} WHERE employee_id=${employeeId};`
            
            if (result.rowCount === 0) {
                return { success: false, message: 'DOB was not updated. Employee ID might be incorrect.' };
            }
        } catch (error: any) {
            console.log(error.message);
            console.log('Failed to update employee DOB');
            return { success: false, message: 'Failed to update employee DOB' };
        }

        return JSON.stringify({
            success: true,
        });
    },
    modifyEmployeeStatus: async ({request}) => {
        const formData = await request.formData();
        const employeeID = formData.get('employee') as string;
        const newActiveStatus = formData.get('newActiveStatus') as string;
    
        // Fetch employee_id for the selected user
        const employeeIdQuery = await sql`SELECT employee_id FROM Employee WHERE CONCAT(first_name, ' ', last_name) = ${employeeID};`;
        if (employeeIdQuery.rows.length === 0) {
            throw new Error("User not found");
        }
    
        const employeeId = employeeIdQuery.rows[0].employee_id;

        const lastActiveValue = newActiveStatus === "" ? null : newActiveStatus;
        //console.log(`Employee NAME: ${employeeID}, EmployeeID: ${employeeId}, status: ${lastActiveValue}`);

        try {
            if (lastActiveValue !== null) {
                await sql`
                    UPDATE Employee 
                    SET last_active = ${lastActiveValue}
                    WHERE employee_id = ${employeeId};
                `;
            } else {
                await sql`
                    UPDATE Employee 
                    SET last_active = NULL
                    WHERE employee_id = ${employeeId};
                `;
            }
        } 
        catch (error: any) {
            console.log(error.message);
            console.log('Failed to update employment status');
            return { success: false, message: 'Failed to update employment status' };
        }

        return JSON.stringify({
            success: true,
        });
    },
    modifyHearingData: async ({ request }) => {
        const formData = await request.formData();
        const user = formData.get('user') as string;
        const year = parseInt(formData.get('year') as string, 10);
        const leftEarFrequencies = JSON.parse(formData.get('leftEarFrequencies') as string);
        const rightEarFrequencies = JSON.parse(formData.get('rightEarFrequencies') as string);
    
        const validateFrequencies = (frequencies: Record<string, string | number>) =>
            Object.values(frequencies).every(value => 
                value === null || 
                value === "CNT" || 
                (!isNaN(parseInt(value as string, 10)) && parseInt(value as string, 10) >= -10 && parseInt(value as string, 10) <= 90)
            );
        
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
    
            // Check if hearing data exists for this employee, year, and ear
            const existingLeftData = await sql`
                SELECT d.data_id FROM Data d
                JOIN Has h ON d.data_id = h.data_id
                WHERE h.employee_id = ${employeeId} AND h.year = ${year} AND h.ear = 'left';
            `;
    
            const existingRightData = await sql`
                SELECT d.data_id FROM Data d
                JOIN Has h ON d.data_id = h.data_id
                WHERE h.employee_id = ${employeeId} AND h.year = ${year} AND h.ear = 'right';
            `;

            const transformFrequencies = (frequencies: Record<string, string | number>) => {
                return Object.fromEntries(
                    Object.entries(frequencies).map(([key, value]) => [
                        key,
                        value === "CNT" || value === null ? null : parseInt(value as string, 10),
                    ])
                );
            };            
    
            const leftEarFrequenciesTransformed = transformFrequencies(leftEarFrequencies);
            const rightEarFrequenciesTransformed = transformFrequencies(rightEarFrequencies);      
    
            if (existingLeftData.rows.length > 0) {
                // Update left ear data
                const leftDataId = existingLeftData.rows[0].data_id;
                await sql`
                    UPDATE Data
                    SET Hz_500 = ${leftEarFrequenciesTransformed.hz500}, Hz_1000 = ${leftEarFrequenciesTransformed.hz1000}, 
                        Hz_2000 = ${leftEarFrequenciesTransformed.hz2000}, Hz_3000 = ${leftEarFrequenciesTransformed.hz3000}, 
                        Hz_4000 = ${leftEarFrequenciesTransformed.hz4000}, Hz_6000 = ${leftEarFrequenciesTransformed.hz6000}, 
                        Hz_8000 = ${leftEarFrequenciesTransformed.hz8000}
                    WHERE data_id = ${leftDataId};
                `;
            } else {
                // Insert new left ear data
                const leftEarDataResult = await sql`
                    INSERT INTO Data (Hz_500, Hz_1000, Hz_2000, Hz_3000, Hz_4000, Hz_6000, Hz_8000)
                    VALUES (${leftEarFrequenciesTransformed.hz500}, ${leftEarFrequenciesTransformed.hz1000}, ${leftEarFrequenciesTransformed.hz2000}, 
                            ${leftEarFrequenciesTransformed.hz3000}, ${leftEarFrequenciesTransformed.hz4000}, ${leftEarFrequenciesTransformed.hz6000}, ${leftEarFrequenciesTransformed.hz8000})
                    RETURNING data_id;
                `;
                const leftEarDataId = leftEarDataResult.rows[0].data_id;
    
                // Insert into Has table
                await sql`
                    INSERT INTO Has (employee_id, data_id, year, ear)
                    VALUES (${employeeId}, ${leftEarDataId}, ${year}, 'left');
                `;
            }
    
            if (existingRightData.rows.length > 0) {
                // Update right ear data
                const rightDataId = existingRightData.rows[0].data_id;
                await sql`
                    UPDATE Data
                    SET Hz_500 = ${rightEarFrequenciesTransformed.hz500}, Hz_1000 = ${rightEarFrequenciesTransformed.hz1000}, 
                        Hz_2000 = ${rightEarFrequenciesTransformed.hz2000}, Hz_3000 = ${rightEarFrequenciesTransformed.hz3000}, 
                        Hz_4000 = ${rightEarFrequenciesTransformed.hz4000}, Hz_6000 = ${rightEarFrequenciesTransformed.hz6000}, 
                        Hz_8000 = ${rightEarFrequenciesTransformed.hz8000}
                    WHERE data_id = ${rightDataId};
                `;
            } else {
                // Insert new right ear data
                const rightEarDataResult = await sql`
                    INSERT INTO Data (Hz_500, Hz_1000, Hz_2000, Hz_3000, Hz_4000, Hz_6000, Hz_8000)
                    VALUES (${rightEarFrequenciesTransformed.hz500}, ${rightEarFrequenciesTransformed.hz1000}, ${rightEarFrequenciesTransformed.hz2000}, 
                            ${rightEarFrequenciesTransformed.hz3000}, ${rightEarFrequenciesTransformed.hz4000}, ${rightEarFrequenciesTransformed.hz6000}, ${rightEarFrequenciesTransformed.hz8000})
                    RETURNING data_id;
                `;
                const rightEarDataId = rightEarDataResult.rows[0].data_id;
    
                // Insert into Has table
                await sql`
                    INSERT INTO Has (employee_id, data_id, year, ear)
                    VALUES (${employeeId}, ${rightEarDataId}, ${year}, 'right');
                `;
            }
    
        } catch (error: any) {
            console.log("Error modifying employee's hearing data:", error.message);
            return { success: false, message: "Failed to modify employee's hearing data due to error" };
        }
    
        return JSON.stringify({
            success: true,
        });
    }, 
    // calculateSTS: async ({ request, fetch }) => {  // Use event-provided `fetch`
    //     const formData = await request.formData();
    //     const employeeID = formData.get('employee') as string;
    //     const year = parseInt(formData.get('year') as string, 10);
    //     const age = parseInt(formData.get('age') as string, 10); //probably going to need to calculate this depending on the year of the test
    //     const sex = formData.get('sex') as string;

    //     let RightBaselineHearingData: number[];
    //     let RightNewHearingData: number[];
    //     let LeftBaselineHearingData: number[];
    //     let LeftNewHearingData: number[];

    //     const extractFrequencies = (earData: Record<string, any>): number[] => {
    //         const { ear, ...frequencies } = earData; // Exclude the 'ear' property
    //         const values = Object.values(frequencies).map(num => Number(num) || 0); // Convert to numbers and handle NaN cases
    //         return values.length === 7 ? values : [...values, ...Array(7 - values.length).fill(0)]; // Ensure exactly 7 elements
    //     }; 
    
    //     if (!employeeID || !year || !age || !sex) {
    //         return json({ success: false, error: "Invalid input" });
    //     }

    //     console.log(`Employee ID: ${employeeID}, sex: ${sex}, Year: ${year}, age: ${age}`);
    
    //     const hearingFormData = new FormData();
    //     hearingFormData.append('employeeID', employeeID);
    //     hearingFormData.append('year', year.toString());
    //     const hearingResponse = await fetch('/dashboard?/fetchHearingData', {
    //         method: 'POST',
    //         body: hearingFormData,
    //     });

    //     const hearingData = await hearingResponse.json();
    //     const result = JSON.parse(JSON.parse(hearingData.data)[0]);
 
    //     if (result["success"]) {
    //         const { baselineData, newData } = result.hearingData;
    //         console.log("BASELINE", baselineData, "NEW", newData);

    //         RightBaselineHearingData = extractFrequencies(baselineData.rightEar);
    //         RightNewHearingData = extractFrequencies(newData.rightEar);
    //         LeftBaselineHearingData = extractFrequencies(baselineData.leftEar);
    //         LeftNewHearingData = extractFrequencies(newData.leftEar);
    //     } 
    //     else {
    //         console.log("Error fetching hearing data for STS calculation");
    //         return { success: false, message: "Failed fetching hearing data for STS calculation due to error" };
    //     }

    //     // Convert sex string to enum
    //     const personSex = sex === "Male" ? PersonSex.Male : sex === "Female" ? PersonSex.Female : PersonSex.Other;
    
    //     // Convert fetched data into HearingScreening objects
    //     const screenings = [
    //         new HearingScreening(
    //             result.hearingData.baselineYear,
    //             new HearingDataOneEar(...RightBaselineHearingData), 
    //             new HearingDataOneEar(...LeftBaselineHearingData)
    //         ),
    //         new HearingScreening(
    //             year,
    //             new HearingDataOneEar(...RightNewHearingData),
    //             new HearingDataOneEar(...LeftNewHearingData)
    //         )
    //     ];      
    
    //     // Create UserHearingScreeningHistory instance
    //     const userHearingHistory = new UserHearingScreeningHistory(age, personSex, year, screenings);
    
    //     // Generate hearing report
    //     const hearingReport = userHearingHistory.GenerateHearingReport();

    //     //console.log(`SCREENINGS: ${JSON.stringify(screenings)}, HISTORY: ${userHearingHistory}`);
    
    //     console.log("REPORT: ", hearingReport);
    
    //     return JSON.stringify({
    //         success: true, 
    //         hearingReport
    //     });
    // },

    calculateSTS: async ({ request }) => { 
        const formData = await request.formData();
        const employeeID = formData.get('employee') as string;
        const year = parseInt(formData.get('year') as string, 10);
        const age = parseInt(formData.get('age') as string, 10); //probably going to need to calculate this depending on the year of the test
        const sex = formData.get('sex') as string;

        if (!employeeID || !year || !age || !sex) {
            return json({ success: false, error: "Invalid input" });
        }

        console.log(`Employee ID: ${employeeID}, sex: ${sex}, Year: ${year}, age: ${age}`);
    
        try {
            const dataQuery = await sql`
                SELECT d.Hz_500, d.Hz_1000, d.Hz_2000, d.Hz_3000, d.Hz_4000, d.Hz_6000, d.Hz_8000, h.ear, h.year
                FROM Has h
                JOIN Data d ON h.data_id = d.data_id
                WHERE h.employee_id = ${employeeID}
                ORDER BY h.year ASC;
            `;
            console.log("query: ", JSON.stringify(dataQuery));

            // Group data by year
            const hearingDataByYear: Record<number, { leftEar: number[], rightEar: number[] }> = {};
            console.log("hearingDataByYear: ", hearingDataByYear);

            dataQuery.rows.forEach(row => {
                const yearKey = Number(row.year);
                const earSide = row.ear.trim().toLowerCase();  // Normalize ear value
            
                console.log(`Processing year: ${yearKey}, ear: ${earSide}, data:`, row);
            
                if (!hearingDataByYear[yearKey]) {
                    hearingDataByYear[yearKey] = { leftEar: new Array(7).fill(0), rightEar: new Array(7).fill(0) };
                }
            
                const frequencies = [
                    Number(row.hz_500) || 0, 
                    Number(row.hz_1000) || 0, 
                    Number(row.hz_2000) || 0, 
                    Number(row.hz_3000) || 0, 
                    Number(row.hz_4000) || 0, 
                    Number(row.hz_6000) || 0, 
                    Number(row.hz_8000) || 0
                ];
                
                console.log(`Frequencies for ${earSide} ear in ${yearKey}:`, frequencies);
            
                if (earSide === 'right') {
                    hearingDataByYear[yearKey].rightEar = frequencies;
                } else if (earSide === 'left') {
                    hearingDataByYear[yearKey].leftEar = frequencies;
                } else {
                    console.warn(`Unexpected ear value: ${row.ear}`);
                }
            });
            
            console.log("Final grouped data:", JSON.stringify(hearingDataByYear, null, 2));

        // Convert fetched data into HearingScreening objects
        const screenings: HearingScreening[] = Object.entries(hearingDataByYear).map(([year, ears]) => 
            new HearingScreening(
                Number(year),
                new HearingDataOneEar(...ears.leftEar),
                new HearingDataOneEar(...ears.rightEar)
            )
        );   
        
        console.log("SCREENINGS: ", screenings);
        
        // Convert sex string to enum
        const personSex = sex === "Male" ? PersonSex.Male : sex === "Female" ? PersonSex.Female : PersonSex.Other;
    
        // Create UserHearingScreeningHistory instance
        const userHearingHistory = new UserHearingScreeningHistory(age, personSex, year, screenings);
        // Generate hearing report
        const hearingReport = userHearingHistory.GenerateHearingReport();

        console.log("REPORT: ", hearingReport);
    
        return JSON.stringify({
            success: true, 
            hearingReport
        });
    }
    catch (error: any) {
        console.log(error.message);
        console.log('Failed to calculate STS status');
        return { success: false, message: 'Failed to calculate STS status due to error' };
    }
    }
};