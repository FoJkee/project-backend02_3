import jwt from 'jsonwebtoken'
import {UserType_Id} from "../types/user-type";
import {ObjectId} from "mongodb";
import {jwtAccess, jwtRefresh, tokenCollection, userCollection} from "../db";
import {tr} from "date-fns/locale";


export const jwtService = {

    async createJwt(user: UserType_Id) {

        const accessToken = jwt.sign({user: user._id}, jwtAccess, {expiresIn: '10s'})
        const refreshToken = jwt.sign({user: user._id}, jwtRefresh, {expiresIn: '20s'})

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


    async removeToken(id: string ,refreshToken: string){
        const token = await userCollection.findOne({_id: new ObjectId(id)})
        if(token){
            const tokenData = await userCollection.deleteOne({refreshToken})
           return tokenData
        }
        return true
    }

}