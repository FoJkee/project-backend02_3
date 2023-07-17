import {body} from "express-validator";


const pattern = "^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$"


export const blogMiddleware = [

    body('name').exists().trim().isString()
        .isLength({min: 1, max: 15}).withMessage('Incorrect name'),
    body('description').exists().trim().isString()
        .isLength({min: 1, max: 500}).withMessage('Incorrect description'),
    body('websiteUrl').exists().trim().isString()
        .isLength({min: 1, max: 100}).withMessage('Incorrect websiteUrl').matches(pattern).withMessage('Incorrect websiteUrl')

]