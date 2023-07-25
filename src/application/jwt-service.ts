import jwt from 'jsonwebtoken'
import {UserType_Id} from "../types/user-type";
import {ObjectId} from "mongodb";
import {jwtAccess, jwtRefresh, userCollection} from "../db";


export const jwtService = {

    async createJwt(user: UserType_Id) {

        const accessToken = jwt.sign({user: user._id}, jwtAccess, {expiresIn: '10s'})
        const refreshToken = jwt.sign({user: user._id}, jwtRefresh, {expiresIn: '30d'})

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


    async removeToken(refreshToken: string){
        const tokenData = await userCollection.deleteOne({refreshToken})
        return tokenData

    },

    async validateRefreshToken(refreshToken: string){
        try {
            const result: any = jwt.verify(refreshToken, jwtRefresh)
            return new ObjectId(result.user)
        } catch (error) {
            return null
        }
    },


    async refresh(refreshToken: string, user: UserType_Id){
        if(!refreshToken){
            return null
        }
        const userData = await this.validateRefreshToken(refreshToken)
        if(!userData){
            return null
        }
       await this.createJwt(user)

        return

    }

}