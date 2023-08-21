import {ObjectId} from "mongodb";

export type UserType_Id = {
    _id: ObjectId,
    login: string,
    email: string,
    passwordHash: string,
    passwordSalt: string,
    createdAt: Date,
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: Date,
        isConfirmed: boolean,

    }
}

export type UserTypeId = { id: string, deviceId?: string } & Omit<UserType_Id, "_id" | 'passwordHash' |
    'passwordSalt' | 'emailConfirmation'>


export type QueryParamsUser = {
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string,
    searchLoginTerm: string,
    searchEmailTerm: string
}

export type UserMe = { userId: string } & Omit<UserTypeId, 'createdAt' | 'id'>

