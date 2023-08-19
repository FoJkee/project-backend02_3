import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";
import {jwtAccess, jwtRefresh} from "../db";
import {randomUUID} from "crypto";


export const jwtService = {

    async createJwt(id: ObjectId) {

        const tokenNew = randomUUID()

        const accessToken: string = jwt.sign({user: id}, jwtAccess, {expiresIn: "100s"})

        const refreshToken: string = jwt.sign({user: id}, jwtRefresh, {expiresIn: "200s"})

        return {
            accessToken, refreshToken
        }

    },


    async getUserByAccessToken(token: string) {

        try {
            const result: any = jwt.verify(token, jwtAccess)
            return result.user
        } catch (error) {
            return null
        }
    },

    async getUserByRefreshToken(token: string) {

        try {
            const result: any = jwt.verify(token, jwtRefresh)
            return result.user
        } catch (error) {
            return null
        }
    }
}