import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";
import {jwtAccess, jwtRefresh} from "../db";


export const jwtService = {

    async createJwt(id: ObjectId) {

        const accessToken: string = jwt.sign({user: id}, jwtAccess, {expiresIn: "100s"})

        const refreshToken: string = jwt.sign({deviseId: id}, jwtRefresh, {expiresIn: "200s"} )

        return {
            accessToken, refreshToken
        }

    },


    async getUserByToken(token: string) {

        try {
            const result: any = jwt.verify(token, jwtAccess)
            return new ObjectId(result.user)
        } catch (error) {
            return null
        }
    },

    async getUserByRefreshToken(token: string) {

        try {
            const result: any = jwt.verify(token, jwtRefresh)

            return new ObjectId(result.user)
        } catch (error) {
            return null
        }
    }
}