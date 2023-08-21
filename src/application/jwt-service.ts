import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";
import {jwtAccess, jwtRefresh} from "../db";
import {de} from "date-fns/locale";



export const jwtService = {

    async createJwt(id: ObjectId, deviceId: string) {


        const accessToken: string = jwt.sign({user: id}, jwtAccess, {expiresIn: "10s"})

        const refreshToken: string = jwt.sign({user: id, deviceId}, jwtRefresh, {expiresIn: "20s"})

        return {
            accessToken, refreshToken
        }

    },

    // async getDeviceRefreshToken(refreshToken: string){
    //     const decoded = await jwt.decode(refreshToken)
    //     console.log("decoded",decoded)
    //
    //     return decoded
    //
    //
    // },


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