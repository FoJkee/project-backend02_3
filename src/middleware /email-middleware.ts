import {body} from "express-validator";
import {userCollection} from "../db";

const patternEmail = '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'
export const emailResending = body('email').exists()
    .isString().withMessage('Incorrect email').matches(patternEmail).withMessage('Incorrect email')



export const emailConfirmation = body('code').exists().isString().withMessage('Incorrect code')
