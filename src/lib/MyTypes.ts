export type Employee = {
    employeeID: string;
    firstName: string;
    lastName: string;
    email: string;
    dob: string;
};

export type EmployeeSelectable = {
    employeeID: string,
    firstName: string,
    lastName: string,
    email: string,
    dob: string,
    selected: boolean
};

export type Admin = {
    name: string,
    email: string,
    id: string,
    isOP: boolean
};

export type AdminSelectable = {
    name: string,
    email: string,
    id: string,
    isOP: boolean
    selected: boolean
};

export type UserSimple = {
    loggedIn: boolean,
    name: string,
    email: string,
    avatar: string
}