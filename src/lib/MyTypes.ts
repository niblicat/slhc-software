export type Employee = {
    employeeID: string,
    firstName: string,
    lastName: string,
    email: string,
    dob: string,
    activeStatus: string,
    sex: string
};

export type Admin = {
    name: string,
    email: string,
    googleID: string,
    isOP: boolean
};

export type AdminSelectable = {
    name: string,
    email: string,
    googleID: string,
    isOP: boolean
    selected: boolean
};

export type UserSimple = {
    loggedIn: boolean,
    name: string,
    email: string,
    avatar: string
}