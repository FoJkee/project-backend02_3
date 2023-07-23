import {Filter, ObjectId, Sort, SortDirection} from "mongodb";
import {Paginated} from "../types/blog-type";
import {UserType_Id, UserTypeId} from "../types/user-type";
import {userRepository} from "../repository/user-repository";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {emailAdapters} from "../adapters/email-adapters";
import {emailConfirmation, emailResending} from "../middleware /email-middleware";
import {userCollection} from "../db";
import {id, tr} from "date-fns/locale";


export const userService = {


    async getUser(searchLoginTerm: string, searchEmailTerm: string, sortBy: string,
                  sortDirection: SortDirection, pageNumber: number, pageSize: number): Promise<Paginated<UserTypeId>> {

        return userRepository.getUser(searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageNumber, pageSize)

    },

    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await userRepository.findLoginOrEmail(loginOrEmail)
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
                isConfirmed: false
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
        const code = uuidv4()
        const newEmail = {
            emailConfirmation: {
                confirmationCode: code,
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3
                }),
            }
        }
        await emailAdapters.sendEmail(email, code)
        return newEmail
    },

    async getUserId(id: string): Promise<UserTypeId | null> {
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

        // const user = await this._findUserByCode(code)
        const user = await userRepository.findUserByConfirmationCode(code)
        if (!user) return null
        if (user.emailConfirmation.isConfirmed) return null
        if (user.emailConfirmation.expirationDate < new Date()) return null

        const result = await userRepository.updateConfirmation(user!._id)
        return result

    },

    async confirmEmail(email: string) {

        const user = await userRepository.findLoginOrEmail(email)
        if (!user) return false
        if (user.emailConfirmation.isConfirmed) return false
        if (user.emailConfirmation.expirationDate < new Date()) return false

        return user
    },


    async _findUserByCode(code: string): Promise<UserType_Id | null> {

        const user = await userRepository.findUserByConfirmationCode(code)
        if (!user) return null
        if (user.emailConfirmation.isConfirmed) return null
        if (user.emailConfirmation.expirationDate < new Date()) return null

        return user
    }


}