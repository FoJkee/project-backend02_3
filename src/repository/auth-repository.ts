import {ObjectId} from "mongodb";
import {tokenCollectionBlack} from "../db";

export const authRepository = {

    async checkRefreshToken(refreshToken: string) {
        return tokenCollectionBlack.findOne({refreshToken})
    },

    async blockRefreshToken(refreshToken: string) {
        return tokenCollectionBlack.insertOne({refreshToken})
    }
}
