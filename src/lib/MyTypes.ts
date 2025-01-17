export type Employee = {
    employeeID: string,
    firstName: string,
    lastName: string,
    email: string,
    dob: string
};

export type Admin = {
    name: string,
    email: string,
    googleID: string,
    isOP: boolean
};

export type UserSimple = {
    loggedIn: boolean,
    name: string,
    email: string,
    avatar: string
}