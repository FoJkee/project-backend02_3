import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {authRepository} from "../repository/auth-repository";
import {userService} from "../domen/user-service";
import {ObjectId} from "mongodb";

export const verifyUserToken = async (req: Request, res: Response, next: NextFunction) => {

    const token: string = req.cookies.refreshToken
    if (!token) return res.sendStatus(401)

    const userToken = await jwtService.getUserByRefreshToken(token)
    if (!userToken) return res.sendStatus(401)

    const userId = await userService.getUserId(new ObjectId(userToken.userId))
    if (!userId) return res.sendStatus(401)

    const isBlocked = await authRepository.checkRefreshToken(token)
    if (isBlocked) return res.sendStatus(401)

    await authRepository.blockRefreshToken(token)

    req.user = userId

    return next()
}