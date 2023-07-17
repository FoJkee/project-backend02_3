import {body} from "express-validator";


export const commentMiddleware = [
    body('content').exists().trim().isString()
        .isLength({min: 20, max: 300}).withMessage('Incorrect content')
]