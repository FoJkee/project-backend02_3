import {Request, Response, Router} from "express";
import {jwtService} from "../application/jwt-service";
import {authPassMiddleware} from "../middleware /authpass-middleware";
import {errorsMiddleware} from "../middleware /errors-middleware";
import {userRepository} from "../repository/user-repository";
import {authBearerMiddleware} from "../middleware /authbearer-middleware";
import {userService} from "../domen/user-service";
import {userMiddleware} from "../middleware /user-middleware";
import {ObjectId} from "mongodb";
import {jwtRefresh} from "../db";


const errorFunc = (...args: string[]) => {
    return {
        errorsMessages: args.map(a => ({message: `error at ${a}`, field: a}))
    }
}
export const authRouter = Router({})

authRouter.post('/registration-confirmation', errorsMiddleware,
    async (req: Request, res: Response) => {

        const result = await userService.confirmCode(req.body.code)

        if (result) {
            return res.sendStatus(204)
        } else {
            return res.status(400).send(errorFunc('code'))
        }

    })

authRouter.post('/registration', userMiddleware, errorsMiddleware, async (req: Request, res: Response) => {

    const user = await userService.createUser(req.body.login, req.body.password, req.body.email)
    return res.sendStatus(204)
})


authRouter.post('/registration-email-resending', errorsMiddleware, async (req: Request, res: Response) => {


    const resendEmail = await userService.createNewEmailConfirmation(req.body.email)
    if (!resendEmail) return res.status(400).json(errorFunc('email'))
    return res.sendStatus(204)

})

authRouter.post('/refresh-token', async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken
    if (!token) return res.sendStatus(401)


    const userToken = await jwtService.getUserByRefreshToken(token)
    if (!userToken) {
        res.sendStatus(401)
        return
    }

    const userId = await userService.getUserId(userToken)

    if (!userId) {
        res.sendStatus(401)
        return
    }

    if (token.refreshToken.Date.now() > token.refreshToken.expiresIn) {
        const newToken = await jwtService.createJwt(new ObjectId(userId.id))
        if (!newToken) return res.sendStatus(401)
        res.cookie('refreshToken', newToken.refreshToken, {httpOnly: true, secure: true})
        return res.status(200).json({accessToken: newToken.accessToken})
    } else {
        return res.sendStatus(401)
    }


})

authRouter.post('/login', authPassMiddleware, errorsMiddleware, async (req: Request, res: Response) => {

    const loginUser = await userService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (loginUser) {
        const token = await jwtService.createJwt(loginUser._id)
        res.cookie('refreshToken', token.refreshToken, {httpOnly: true, secure: true})
        res.status(200).json({accessToken: token.accessToken})
    } else {
        res.sendStatus(401)
    }
})


authRouter.post('/logout', errorsMiddleware, async (req: Request, res: Response) => {

    const token = req.cookies.refreshToken

    if (!token) {
        res.sendStatus(401)
        return
    }

    const userToken = await jwtService.getUserByRefreshToken(token)
    if (!userToken) {
        res.sendStatus(401)
        return
    }

    const userId = await userService.getUserId(userToken)

    if (!userId) {
        res.sendStatus(401)
        return
    }

    res.clearCookie('refreshToken')
    return res.sendStatus(204)

})


authRouter.get('/me', authBearerMiddleware, async (req: Request, res: Response) => {

    const userMe = await userRepository.getMe()

    return res.status(200).json(userMe)

})