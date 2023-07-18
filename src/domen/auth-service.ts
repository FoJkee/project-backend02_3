import {authRepository} from "../repository/auth-repository";
import {userService} from "./user-service";



export const authService = {

    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await authRepository.findLoginOrEmail(loginOrEmail)
        if (!user) return false

        const passwordHash = await userService._generateHash(password, user.passwordSalt)

        if (user.passwordHash !== passwordHash) {
            return false
        }
        return user
    },








}