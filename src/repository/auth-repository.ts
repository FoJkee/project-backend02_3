import {tokenCollection, userCollection} from "../db";
import {ObjectId} from "mongodb";
import {userRepository} from "./user-repository";


export const authRepository = {

    async timeToken(token: string) {
        const tokenRefresh = await tokenCollection.findOne({refreshToken: token})
        return tokenRefresh

    }
}
