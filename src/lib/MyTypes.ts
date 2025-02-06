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

export type HearingDataSingle = {
    hz500?: number,
    hz1000?: number,
    hz2000?: number,
    hz3000?: number,
    hz4000?: number,
    hz6000?: number,
    hz8000?: number
}