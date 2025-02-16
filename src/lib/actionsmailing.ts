import { sql } from '@vercel/postgres';

interface Request {
    formData: () => Promise<FormData>;
}

interface EmployeeData {
    employeeID: string;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
}

interface HearingData {
    year: number;
    ear: string;
    hz500: number | null;
    hz1000: number | null;
    hz2000: number | null;
    hz3000: number | null;
    hz4000: number | null;
    hz6000: number | null;
    hz8000: number | null;
}

export async function extractAllEmployeeData(request: Request) {
    try {
        // You can process request if needed
        await request.formData();

        const employeesQuery = await sql`
            SELECT employee_id, first_name, last_name, email, date_of_birth, sex
            FROM Employee
            ORDER BY last_name, first_name;
        `;

        const employees: EmployeeData[] = employeesQuery.rows.map(row => ({
            employeeID: row.employee_id,
            firstName: row.first_name,
            lastName: row.last_name,
            email: row.email,
            dateOfBirth: row.date_of_birth
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

        let allHearingData: HearingData[] = [];

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

            const hearingData: HearingData[] = hearingDataQuery.rows.map(row => ({
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


// export async function exportToCSV(request: Request) {
//     try {
//         await request.formData();

//         // Get all employees
//         const employeesQuery = await sql`
//             SELECT e.employee_id, e.first_name, e.last_name, e.email, e.date_of_birth,
//                    h.year, h.ear,
//                    d.Hz_500, d.Hz_1000, d.Hz_2000, d.Hz_3000, d.Hz_4000, d.Hz_6000, d.Hz_8000
//             FROM Employee e
//             LEFT JOIN Has h ON e.employee_id = h.employee_id
//             LEFT JOIN Data d ON h.data_id = d.data_id
//             ORDER BY e.last_name, e.first_name, h.year, h.ear;
//         `;

//         // Process the data into a format suitable for CSV
//         const processedData = employeesQuery.rows.reduce((acc: any[], row) => {
//             // Create basic employee info
//             const baseInfo = {
//                 employeeID: row.employee_id,
//                 firstName: row.first_name,
//                 lastName: row.last_name,
//                 email: row.email,
//                 dateOfBirth: new Date(row.date_of_birth).toISOString().split('T')[0],
//                 year: row.year || '',
//                 ear: row.ear || '',
//                 hz500: row.hz_500 ?? '',
//                 hz1000: row.hz_1000 ?? '',
//                 hz2000: row.hz_2000 ?? '',
//                 hz3000: row.hz_3000 ?? '',
//                 hz4000: row.hz_4000 ?? '',
//                 hz6000: row.hz_6000 ?? '',
//                 hz8000: row.hz_8000 ?? ''
//             };

//             acc.push(baseInfo);
//             return acc;
//         }, []);

//         // Convert to CSV format
//         const headers = [
//             "Employee ID", "First Name", "Last Name", "Email", "Date of Birth",
//             "Year", "Ear", "500 Hz", "1000 Hz", "2000 Hz", "3000 Hz",
//             "4000 Hz", "6000 Hz", "8000 Hz"
//         ];

//         const csvRows = processedData.map(row => [
//             row.employeeID,
//             row.firstName,
//             row.lastName,
//             row.email,
//             row.dateOfBirth,
//             row.year,
//             row.ear,
//             row.hz500,
//             row.hz1000,
//             row.hz2000,
//             row.hz3000,
//             row.hz4000,
//             row.hz6000,
//             row.hz8000
//         ].join(','));

//         const csvContent = [headers.join(','), ...csvRows].join('\n');

//         console.log("ROWS: ", csvRows);
//         console.log("CONTENT: ", csvContent);

//         return JSON.stringify({
//             success: true,
//             csv: csvRows
//         });
//     } catch (error: any) {
//         const errorMessage = "Failed to export data to CSV: " + (error.message ?? "no error message provided by server");
//         console.error(errorMessage);
//         return JSON.stringify({ success: false, message: errorMessage });
//     }
// }
