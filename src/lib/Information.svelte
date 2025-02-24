<script lang="ts">
    import { Accordion, AccordionItem, Li, List } from "flowbite-svelte";
</script>

<Accordion>
    <AccordionItem>
        <span slot="header">Learn about the Admins Page</span>
        <Li>Grant admin privileges to registered users by clicking the edit icon in the "Is Admin" column.</Li>
        <Li>Setting "True" allows admin access, while "False" restricts it.</Li>
        <Li>Edit an admin's name by clicking the edit icon and updating their full name.</Li>
        <Li>Delete admins by selecting the checkbox in the far-left column and clicking the delete button at the bottom.</Li>
        <Li>To delete all admins at once, click the top checkbox next to the "Name" column, then select the delete button.</Li>
    </AccordionItem>
    <AccordionItem>
        <span slot="header">Learn about the Employees Page</span>
        <Li>Use the dropdown menus at the top of the page to select an employee and a year.</Li>
        <Li>Employee information is displayed on the left, while the data graph appears on the right.</Li>
        <Li>To edit employee information, click the edit button next to the item you want to update.</Li>
        <br>
        <Accordion class="bg-gray-100">
            <AccordionItem>
                <span slot="header">Adding New Employees</span>
                <Li>Click the button to the right of the year dropdown menu (a person icon with a plus symbol).</Li>
                <Li>Enter the employee's first name, last name, SIUE email, date of birth, sex, and employment status.</Li>
                <Li>If the employee is no longer employed, an additional field will appear to input their last employment date.</Li>
                <Li>Click "Submit" to add the employee to the table.</Li>
            </AccordionItem>
            <AccordionItem>
                <span slot="header">Adding New Employee Data</span>
                <Li>Select an employee from the dropdown to add a new year of data.</Li>
                <Li>Once selected, a new button (a circle with a plus symbol) will appear to the right of the "Add Employee" button.</Li>
                <Li>Enter the year you want to add and click the check button to validate it.</Li>
                <Li>If the year is valid, a data entry table will appear; otherwise, an error message will be displayed.</Li>
                <Li>Input left and right ear data (accepted values: -10 to 90 or 'CNT').</Li>
                <Li>Click "Submit" to save the data to the table.</Li>
            </AccordionItem>
            <AccordionItem>
                <span slot="header">Editing Employee Data</span>
                <Li>Select an employee and enter the year you want to edit.</Li>
                <Li>Once both are selected, a new button (a notepad and pencil icon) will appear.</Li>
                <Li>Click this button to edit the data for the selected employee and year.</Li>
                <Li>A table will display the existing data—update the necessary information.</Li>
                <Li>Click "Submit" to save changes to the data table.</Li>
            </AccordionItem>
            <AccordionItem>
                <span slot="header">Understanding the Data Graph</span>
                <p class="text-gray-500 dark:text-gray-400"></p>
                <Li>The graph offers "Left," "Right," and "Both" options to view specific data sets.</Li>
                <Li>Hovering over or clicking on points displays their exact coordinates.</Li>
                <Li>Clicking on colors in the top legend will toggle the visibility of the corresponding data set.</Li>
            </AccordionItem>
        </Accordion>
    </AccordionItem>
    <AccordionItem>
        <span slot="header">Learn about the Mailings Page Page</span>
        <Li>All employees are listed by their database-assigned Employee ID.</Li>
        <Li>Below the employee information, you will find two buttons: "Create CSV" and "Download Template."</Li>
        <Li>First, click "Export to CSV" to download a file named <em>employees.csv</em>. You do not need to open this file, but ensure you remember its download location.</Li>
        <Li>Next, click "Download Template" to download a document titled <em>SLHC Email Template</em>. Open this file in Microsoft Word.</Li>
        <Li>In the Word document, navigate to the "Mailings" tab and select the "Start Mail Merge" button.</Li>
        <Li>From the "Start Mail Merge" dropdown menu, ensure "Email Messages" is selected, then close the dropdown.</Li>
        <Li>Click "Select Recipients" and choose "Use an Existing List."</Li>
        <Li>When prompted, locate and select the previously downloaded <em>employees.csv</em> file.</Li>
        <Li>You may be prompted to edit or filter the recipient list, but this step is optional.</Li>
        <Li>Also optionally, you can click "Preview Results" to review how the employee data appears in the template.</Li>
        <Li>Finally, click "Finish & Merge," then select "Merge to E-Mail" to complete the process.</Li>
    </AccordionItem>
</Accordion>