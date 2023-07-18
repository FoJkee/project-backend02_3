import {userCollection} from "../db";
import bcrypt, {hash} from "bcrypt";
import {ObjectId} from "mongodb";



export const authRepository = {

    async findLoginOrEmail(loginOrEmail: string) {
        const user = await userCollection.findOne({
            $or: [{login: loginOrEmail}, {email: loginOrEmail}]
        })
        return user
    },


    async createNewUser(login: string, email: string, password: string){

        const passwordHashNewUser = await this._generateHash(password)

        const userRegistration = {
            _id: new ObjectId(),


        }





    },


    async _generateHash(password: string){
        const hash = await bcrypt.hash(password, 10)
        return hash
    }



}

