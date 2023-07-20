import jwt from 'jsonwebtoken'
import {UserType_Id} from "../types/user-type";
import {ObjectId} from "mongodb";
import {jwtSecret} from "../db";
import {userService} from "../domen/user-service";
import {id} from "date-fns/locale";
import {userRepository} from "../repository/user-repository";


export const jwtService = {

    async createJwt(user: UserType_Id) {

        const token = jwt.sign({user: user._id}, jwtSecret, {expiresIn: '5h'})
        return token

    },

    async getUserByToken(token: string) {

        try {
            const result: any = jwt.verify(token, jwtSecret)
            return new ObjectId(result.user)
        } catch (error) {
            return null
        }
    }

}