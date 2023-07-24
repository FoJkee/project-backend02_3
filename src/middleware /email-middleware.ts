import {body} from "express-validator";
import {userCollection} from "../db";
import {tr} from "date-fns/locale";

const patternEmail = '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'
export const emailResending = body('email').exists()
    .isString().matches(patternEmail).withMessage('Incorrect email').custom(async val => {
        const user = await userCollection.findOne({email: val})
        console.log('user', user)
        if(!user)  throw new Error('Incorrect email')
        if(user.emailConfirmation.isConfirmed) throw new Error('email already confirmed')
        return true
    })



export const confirmationCodeAllReadyConfirmed = body('code').exists().isString().withMessage('Incorrect code')
    .custom(async val => {
    const user = await userCollection.findOne({ code: val})
        if(!user) throw new Error('Incorrect code')
    if(user.emailConfirmation.isConfirmed) throw new Error('code already confirmed')
    return true
})
