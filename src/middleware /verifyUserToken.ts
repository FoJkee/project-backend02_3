import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {authRepository} from "../repository/auth-repository";
import {userService} from "../domen/user-service";

export const verifyUserToken = async (req: Request, res: Response, next: NextFunction) => {

    const token = req.cookies.refreshToken
    if (!token) return res.sendStatus(401)

    const userToken = await jwtService.getUserByRefreshToken(token)
    if (!userToken) return res.sendStatus(401)

    const isBlocked = await authRepository.checkRefreshToken(token)
    if (!isBlocked) return res.sendStatus(401)

    const userId = await userService.getUserId(userToken)
    if (!userId) return res.sendStatus(401)

    return next()
}