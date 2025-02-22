import { sql } from '@vercel/postgres';
import type { Employee, HearingDataSingle } from './MyTypes';

interface Request {
    formData: () => Promise<FormData>;
}

// interface EmployeeData {
//     employeeID: string;
//     firstName: string;
//     lastName: string;
//     email: string;
//     dateOfBirth: string;
// }

// interface HearingData {
//     year: number,
//     ear: string,
//     hz500: string,
//     hz1000: string,
//     hz2000: string,
//     hz3000: string,
//     hz4000: string,
//     hz6000: string,
//     hz8000: string
// }

export async function extractAllEmployeeData(request: Request) {
    try {
        // You can process request if needed
        await request.formData();

        const employeesQuery = await sql`
            SELECT first_name, last_name, email,
            FROM Employee
            ORDER BY last_name, first_name;
        `;

        const employees: Employee[] = employeesQuery.rows.map(row => ({
            firstName: row.first_name,
            lastName: row.last_name,
            email: row.email,
        }));

        return JSON.stringify({ 
            success: true, 
            employees 
        });
    } catch (error: any) {
        const errorMessage = "Failed to extract employee data: " + (error.message ?? "no error message provided by server");
        console.error(errorMessage);
        return JSON.stringify({ success: false, message: errorMessage });
    }
}

export async function extractHearingData(request: Request) {
    try {
        const formData = await request.formData();
        const employeeIDs = formData.get('employeeIDs') as string;
        const parsedEmployeeIDs = JSON.parse(employeeIDs);

        let allHearingData: HearingDataSingle[] = [];

        for (const singleID of parsedEmployeeIDs) {
            // Verify the employee exists
            const employeeCheck = await sql`
                SELECT employee_id FROM Employee WHERE employee_id = ${singleID};
            `;

            if (employeeCheck.rows.length === 0) {
                throw new Error("Employee not found");
            }

            // Fetch all hearing data for the employee
            const hearingDataQuery = await sql`
                SELECT h.year, h.ear, 
                    d.Hz_500, d.Hz_1000, d.Hz_2000, d.Hz_3000, 
                    d.Hz_4000, d.Hz_6000, d.Hz_8000
                FROM Has h
                JOIN Data d ON h.data_id = d.data_id
                WHERE h.employee_id = ${singleID}
                ORDER BY h.year, h.ear;
            `;

            const hearingData: HearingDataSingle[] = hearingDataQuery.rows.map(row => ({
                id: singleID,
                year: row.year,
                ear: row.ear,
                hz500: row.hz_500,
                hz1000: row.hz_1000,
                hz2000: row.hz_2000,
                hz3000: row.hz_3000,
                hz4000: row.hz_4000,
                hz6000: row.hz_6000,
                hz8000: row.hz_8000
            }));

            allHearingData = allHearingData.concat(hearingData); // Accumulate data for all employees
        }

        return JSON.stringify({
            success: true,
            hearingData: allHearingData
        });
    } catch (error: any) {
        const errorMessage = "Failed to extract hearing data: " + (error.message ?? "no error message provided by server");
        console.error(errorMessage);
        return JSON.stringify({ success: false, message: errorMessage });
    }
}