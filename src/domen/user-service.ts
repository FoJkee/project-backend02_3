import {Filter, ObjectId, Sort, SortDirection} from "mongodb";
import {Paginated} from "../types/blog-type";
import {UserType_Id, UserTypeId} from "../types/user-type";
import {userRepository} from "../repository/user-repository";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {emailAdapters} from "../adapters/email-adapters";
import { userCollection} from "../db";
import {randomUUID} from "crypto";



export const userService = {


    async getUser(searchLoginTerm: string, searchEmailTerm: string, sortBy: string,
                  sortDirection: SortDirection, pageNumber: number, pageSize: number): Promise<Paginated<UserTypeId>> {

        return userRepository.getUser(searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageNumber, pageSize)

    },

    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await userRepository. findLoginOrEmail(loginOrEmail)
        if (!user) return null

        const passwordHash = await this._generateHash(password, user.passwordSalt)

        if (user.passwordHash !== passwordHash) {
            return false
        }

        return user
    },

    async createUser(login: string, password: string, email: string): Promise<UserTypeId | null> {

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)
        const code = uuidv4()
        const userNew: UserType_Id = {
            _id: new ObjectId(),
            login,
            email,
            passwordHash,
            passwordSalt,
            createdAt: new Date(),
            emailConfirmation: {
                confirmationCode: code,
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3
                }),
                isConfirmed: false,

            }
        }
        const createResult = await userRepository.createUser(userNew)
        try {
            await emailAdapters.sendEmail(email, code)

        } catch (error) {
            console.error(error)
            await userRepository.deleteUserId(userNew!._id)
            return null
        }
        return createResult
    },

    async createNewEmailConfirmation(email: string) {
        const user = await userCollection.findOne({email, 'emailConfirmation.isConfirmed': false})
        if (!user) return null
        const code: string = randomUUID()
        const newEmailConfirmation = {

            confirmationCode: code,
            expirationDate: add(new Date(), {
                hours: 1,
                minutes: 3
            }),
            isConfirmed: false,

        }
        await userCollection.updateOne({email}, {$set: {emailConfirmation: newEmailConfirmation}})
        await emailAdapters.sendEmail(email, code)
        return true
    },

    async getUserId(id: ObjectId): Promise<UserTypeId | null> {
        return userRepository.getUserId(id)

    },

    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash
    },

    async deleteUserId(id: ObjectId): Promise<boolean> {
        return userRepository.deleteUserId(id)
    },

    async deleteUserAll(): Promise<boolean> {
        return userRepository.deleteUserAll()
    },

    async confirmCode(code: string) {

        const user = await userRepository.findUserByConfirmationCode(code)

        if (!user) return null
        if (user.emailConfirmation.isConfirmed) return null
        if (user.emailConfirmation.expirationDate < new Date()) return null

        const result = await userRepository.updateConfirmation(user._id)

        return user

    },

    // async confirmToken(token: string){
    //     const newToken = await authRepository.timeToken(token)
    //
    //     if(!newToken) return null
    //     if(newToken.refreshToken < new Date()) return null
    //
    // }



}