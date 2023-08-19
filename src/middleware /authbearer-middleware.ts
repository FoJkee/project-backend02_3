import {Request, Response, NextFunction} from "express";
import {jwtService} from "../application/jwt-service";
import {userService} from "../domen/user-service";
import {ObjectId} from "mongodb";


export const authBearerMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.headers.authorization) return res.sendStatus(401)

    const token = req.headers.authorization.split(' ')[1]
    if(!token) return  res.sendStatus(401)

    const userId = await jwtService.getUserByAccessToken(token)

    if (userId) {
        req.user = await userService.getUserId(userId)
        return next()
    }
    return res.sendStatus(401)
}