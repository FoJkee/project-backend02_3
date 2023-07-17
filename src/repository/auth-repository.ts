import {userCollection} from "../db";


export const authRepository = {

    async findLoginOrEmail(loginOrEmail: string) {
        const user = await userCollection.findOne({
            $or: [{login: loginOrEmail}, {email: loginOrEmail}]
        })
        return user
    },

}

