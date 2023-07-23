import {body} from "express-validator";
import {userCollection} from "../db";

const loginPattern = '^[a-zA-Z0-9_-]*$'

const emailPattern = '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'
export const userMiddleware = [
    body('login').exists().trim().isString()
        .isLength({min: 3, max: 10}).withMessage('Incorrect login')
        .matches(loginPattern).withMessage('Incorrect login').custom(async val => {
        const user = await userCollection.findOne({login: val})
        if (user) throw new Error('this login already exists')
        return true
    }),
    body('password').exists().trim().isString()
        .isLength({min: 6, max: 20}).withMessage('Incorrect password'),
    body('email').exists().trim().isString().withMessage('Incorrect email')
        .matches(emailPattern).withMessage('Incorrect email').custom(async val => {
        const user = await userCollection.findOne({email: val})
        if (user) throw new Error('this email already exists')
        return true
    })
]