import {body} from "express-validator";

const loginPattern = '^[a-zA-Z0-9_-]*$'

const emailPattern = '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'
export const userMiddleware = [
    body('login').exists().trim().isString()
        .isLength({min: 3, max: 10}).withMessage('Incorrect login').matches(loginPattern).withMessage('Incorrect login'),
    body('password').exists().trim().isString()
        .isLength({min: 6, max: 20}).withMessage('Incorrect password'),
    body('email').exists().trim().isString().withMessage('Incorrect email')
        .matches(emailPattern).withMessage('Incorrect email')
]