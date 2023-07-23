import {NextFunction, Request, Response} from "express";
import {ValidationChain, validationResult} from "express-validator";

export const errorsMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const errMes = ({msg, path}: any) => {
        return {
            message: msg,
            field: path
        }

    }
    const resultErr = validationResult(req).formatWith(errMes)
    if (!resultErr.isEmpty()) {
        res.status(400).json({errorsMessages: resultErr.array({onlyFirstError: true})})
    } else {
        next()

    }

}