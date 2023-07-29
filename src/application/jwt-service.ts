import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";
import {jwtAccess, jwtRefresh, tokenCollection, userCollection} from "../db";
import {randomUUID} from "crypto";


export const jwtService = {

    async createJwt(id: ObjectId) {

        const accessToken: string = jwt.sign({user: id}, jwtAccess, {expiresIn: "10sec"})

        const refreshToken: string = jwt.sign({user: id}, jwtRefresh, {expiresIn: "20sec"} )

        return {
            accessToken, refreshToken
        }

    },

    // async saveToken(user: UserType_Id, refreshToken: string){
    //     const token = await tokenCollection.findOne({user: user._id})
    //     if(token){
    //         token.refreshToken = refreshToken
    //         return await token.save()
    //     }
    //     return await tokenCollection.insertOne({user: user._id, refreshToken})
    // },


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
    },


    // async removeToken(id: string, refreshToken: string) {
    //     const token = await userCollection.findOne({_id: new ObjectId(id)})
    //     if (token) {
    //         const tokenData = await userCollection.deleteOne({refreshToken})
    //         return tokenData
    //     }
    //     return true
    // }

}