import jwt from 'jsonwebtoken'
import {jwtAccess, jwtRefresh} from "../db";
import {TokenPayload} from "../types/token-type";
import {ObjectId} from "mongodb";


export const jwtService = {

    async createAccessToken(id: ObjectId) {
        return jwt.sign({user: id}, jwtAccess, {expiresIn: "1000s"})

    },

    async createRefreshToken(id: ObjectId, deviceId: string) {

        return jwt.sign({user: id, deviceId}, jwtRefresh, {expiresIn: "2000s"})

    },


    async getUserByAccessToken(token: string) {

        try {
            const result: any = jwt.verify(token, jwtAccess)
            return result.user
        } catch (error) {
            return null
        }
    },

    async getUserByRefreshToken(token: string): Promise<TokenPayload | null> {
        try {
            const result: any = jwt.verify(token, jwtRefresh)
            return {
                userId: result.user,
                deviceId: result.deviceId,
            }
        } catch {
            return null
        }
    },

    async getLastActiveDateFromToken(token: string){
        const result: any = jwt.decode(token)
        return  new Date(result!.iat * 1000).toISOString()
    }

}


export const jstPayload = (refreshToken: string): {

    userId: string, deviceId: string, iat: string } | null => {
    try {
        return JSON.parse(Buffer.from(refreshToken.split('.')[1],
            'base64url').toString())

    } catch {
        return null
    }

}