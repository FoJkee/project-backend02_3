import {body} from "express-validator";

const patternEmail = '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'
export const emailResending = body('email').exists().isEmail()
    .isString().withMessage('Incorrect email').matches(patternEmail).withMessage('Incorrect email')


export const emailConfirmation = body('code').exists().isString().withMessage('Incorrect code')