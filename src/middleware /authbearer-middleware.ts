import {Request, Response, NextFunction} from "express";
import {jwtService} from "../application/jwt-service";
import {userService} from "../domen/user-service";
import {ObjectId} from "mongodb";


export const authBearerMiddleware = async (req: Request, res: Response, next: NextFunction) => {


    if (!req.headers.authorization) {
        res.sendStatus(401)
        return
    }

    const token = req.headers.authorization.split(' ')[1]

    if(!token){
        res.sendStatus(401)
        return
    }


    const userId = await jwtService.getUserByToken(token)

    if (userId) {
        req.user = await userService.getUserId(userId)
        return next()
    }
    res.sendStatus(401)
}