import {authRepository} from "../repository/auth-repository";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import bcrypt from "bcrypt";
import add from "date-fns/add"
import {AccountUserRegType} from "../types/auth-type";
import {jwtSecret} from "../db";
import jwt from "jsonwebtoken";
import {emailAdapters} from "../adapters/email-adapters";
import e from "express";


export const authService = {

    // async checkCredentials(loginOrEmail: string, password: string) {
    //     const user = await authRepository.findByLoginOrEmail(loginOrEmail)
    //     if (!user) return null
    //
    //     if (!user.emailConfirmation.isConfirmed) {
    //         return null
    //     }
    //
    //     const isHashesEquals = await this._isPasswordCorrect(password, user.accountData.passwordHashNewUser)
    //
    //     if (isHashesEquals) {
    //         return user
    //     } else {
    //         return null
    //     }
    // },


    async createRegNewUser(login: string, email: string, password: string): Promise<AccountUserRegType | null> {

        const passwordHashNewUser = await this._generateHash(password)
        const userRegistration: AccountUserRegType = {
            _id: new ObjectId(),
            accountData: {
                login,
                email,
                passwordHashNewUser,
                createdAt: new Date()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3
                }),
                isConfirmed: false
            }
        }
        const createResult = authRepository.createRegNewUser(userRegistration)
        await emailAdapters.sendEmail(email)
        return createResult
    },

    async _generateHash(password: string) {
        const hash = await bcrypt.hash(password, 10)
        return hash
    },

    async _isPasswordCorrect(password: string, hash: string) {
        const isEqual = await bcrypt.compare(password, hash)
        return isEqual
    },

    // async checkAndFindUserByToken(token: string) {
    //     try {
    //         const result: any = jwt.verify(token, jwtSecret)
    //         const user = await authRepository.findUserById(new ObjectId(result.userId))
    //         return user
    //     } catch (error) {
    //         return null
    //     }
    // },

    async confirmEmail(code: string) {
        let user = await authRepository.findUserByConfirmation(code)
        if (!user) return false
        if (user.emailConfirmation.isConfirmed) return false
        if (user.emailConfirmation.confirmationCode !== code) return false
        if (user.emailConfirmation.expirationDate < new Date()) return false

        let result = await authRepository.updateConfirmation(user._id)
        return result

    },




}