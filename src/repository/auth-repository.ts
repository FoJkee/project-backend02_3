import { userCollection} from "../db";
// import {AccountUserRegType} from "../types/auth-type";
import {ObjectId} from "mongodb";



// export const authRepository = {
//
//    async createRegNewUser(userRegistration: any){
//         const result = await userAccountCollection.insertOne(userRegistration)
//        return userRegistration
//     },
//
//
//     async findByLoginOrEmail(loginOrEmail: string){
//         const user = await userAccountCollection.findOne(
//             {$or: [{'accountData.email': loginOrEmail}, {'accountData.userName': loginOrEmail}]})
//         return user
//     },
//
//     async findUserByConfirmation(emailConfirmationCode: string){
//         const user = await userAccountCollection.findOne(
//             {'emailConfirmation.confirmationCode': emailConfirmationCode})
//         return user
//     },
//
//     async updateConfirmation(_id: ObjectId){
//
//         let result = await userAccountCollection.updateOne({_id},
//             {$set: {"emailConfirmation.isConfirmed": true}})
//         return result.modifiedCount === 1
//     }
//
// }

