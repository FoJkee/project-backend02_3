import {ObjectId} from "mongodb";

export type UserType_Id = {
    _id: ObjectId,
    login: string,
    email: string,
    passwordHash: string,
    passwordSalt: string,
    createdAt: string
}

export type UserTypeId= {id: string} & Omit<UserType_Id, "_id" | 'passwordHash' | 'passwordSalt'>


export type QueryParamsUser = {
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string,
    searchLoginTerm: string,
    searchEmailTerm: string
}

export type UserMe = {userId : string} & Omit<UserTypeId, 'createdAt' | 'id'>