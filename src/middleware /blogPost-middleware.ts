import {body} from "express-validator";

export const blogPostMiddleware = [
    body('title').exists().trim().isString()
        .isLength({min: 1, max: 30}).withMessage('Incorrect title'),
    body('shortDescription').exists().trim().isString()
        .isLength({min: 1, max: 100}).withMessage('Incorrect shortDescription'),
    body('content').exists().trim().isString()
        .isLength({min: 1, max: 1000}).withMessage('Incorrect content')

]