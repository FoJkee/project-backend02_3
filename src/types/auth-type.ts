import {ObjectId, WithId} from "mongodb";


export type AccountUserRegType = WithId<{
    accountData: {
        login: string,
        email: string
        passwordHashNewUser: string,
        createdAt: Date
    },
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: Date
        isConfirmed: false
    }
}>

