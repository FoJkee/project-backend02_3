import {body} from "express-validator";


export const authPassMiddleware = [
    body('loginOrEmail').exists().trim().isString().withMessage('Incorrect loginOrEmail'),
    body('password').exists().trim().isString().withMessage('Incorrect password')

]