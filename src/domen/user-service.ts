import {Filter, ObjectId, Sort, SortDirection} from "mongodb";
import {Paginated} from "../types/blog-type";
import {UserType_Id, UserTypeId} from "../types/user-type";
import {userCollection} from "../db";
import {userRepository} from "../repository/user-repository";
import bcrypt from "bcrypt";
import {authRepository} from "../repository/auth-repository";


export const userService = {


    async getUser(searchLoginTerm: string, searchEmailTerm: string, sortBy: string,
                  sortDirection: SortDirection, pageNumber: number, pageSize: number): Promise<Paginated<UserTypeId>> {

        return userRepository.getUser(searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageNumber, pageSize)

    },

    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await userRepository.findLoginOrEmail(loginOrEmail)
        if (!user) return false

        const passwordHash = await userService._generateHash(password, user.passwordSalt)

        if (user.passwordHash !== passwordHash) {
            return false
        }
        return user
    },

    async createUser(login: string, password: string, email: string): Promise<UserTypeId> {

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)

        const userNew: UserType_Id = {
            _id: new ObjectId(),
            login,
            email,
            passwordHash,
            passwordSalt,
            createdAt: new Date().toISOString()
        }
        return userRepository.createUser(userNew)

    },

    async getUserId(id: string): Promise<UserTypeId | null> {
        return userRepository.getUserId(id)

    },

    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash
    },

    async deleteUserId(id: string): Promise<boolean> {
        return userRepository.deleteUserId(id)
    },

    async deleteUserAll(): Promise<boolean> {
        return userRepository.deleteUserAll()
    }

}