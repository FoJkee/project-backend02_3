import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";
import {jwtAccess, jwtRefresh} from "../db";


export const jwtService = {

    async createJwt(id: ObjectId, deviceId: string) {


        const accessToken: string = jwt.sign({user: id}, jwtAccess, {expiresIn: "100s"})

        const refreshToken: string = jwt.sign({user: id, deviceId}, jwtRefresh, {expiresIn: "200s"})

        return {
            accessToken, refreshToken
        }

    },

    async getDeviceRefreshToken(refreshToken: string, deviceId: string){



    },


    async getUserByAccessToken(token: string) {

        try {
            const result: any = jwt.verify(token, jwtAccess)
            return result.user // payload = userId, deviceId; iat, exp
        } catch (error) {
            return null
        }
    },

    async getUserByRefreshToken(token: string) {
        try {
            const result: any = jwt.verify(token, jwtRefresh)
            const decoded = jwt.decode(result)
            console.log("decoded", decoded)
            return result.user
        } catch (error) {
            return null
        }
    }
}