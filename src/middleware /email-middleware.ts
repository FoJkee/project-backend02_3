import {body} from "express-validator";
import {userCollection} from "../db";

const patternEmail = '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'
export const emailResending = body('email').exists()
    .isString().withMessage('Incorrect email').matches(patternEmail).withMessage('Incorrect email')
    .custom(async val => {
        const user = await userCollection.findOne({email: val})
    if(user) throw new Error('Email of already registered but not confirmed user')
    })


export const emailConfirmation = body('code').exists().isString().withMessage('Incorrect code')
    .custom(async val => {
        const user = await userCollection.findOne({code: val})
        if(user) throw new Error('this code already exists')
    })