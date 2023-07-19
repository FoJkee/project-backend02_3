import {userAccountCollection, userCollection} from "../db";
import {AccountUserRegType} from "../types/auth-type";
import {ObjectId} from "mongodb";



export const authRepository = {





   async createRegNewUser(userRegistration: AccountUserRegType){
        const result = await userAccountCollection.insertOne(userRegistration)
       return userRegistration
    },



    async findUserById(id:ObjectId): Promise<AccountUserRegType | null>{
        let product = await userAccountCollection.findOne({_id: id})
        if(product){
            return product
        } else {
            return null
        }
    },

    async findByLoginOrEmail(loginOrEmail: string){
        const user = await userAccountCollection.findOne(
            {$or: [{'accountData.email': loginOrEmail}, {'accountData.userName': loginOrEmail}]})
        return user
    },

    async findUserByConfirmation(emailConfirmationCode: string){
        const user = await userAccountCollection.findOne(
            {'emailConfirmation.confirmationCode': emailConfirmationCode})
        return user
    },



    async updateConfirmation(_id: ObjectId){

        let result = await userAccountCollection.updateOne({_id},
            {$set: {"emailConfirmation.isConfirmed": true}})
        return result.modifiedCount === 1
    }

}

