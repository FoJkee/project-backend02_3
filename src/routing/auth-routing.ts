import {Request, Response, Router} from "express";
import {jwtService} from "../application/jwt-service";
import {authPassMiddleware} from "../middleware /authpass-middleware";
import {errorsMiddleware} from "../middleware /errors-middleware";
import {userRepository} from "../repository/user-repository";
import {authBearerMiddleware} from "../middleware /authbearer-middleware";
import {userService} from "../domen/user-service";
import {userMiddleware} from "../middleware /user-middleware";
import {ObjectId} from "mongodb";
import {verifyUserToken} from "../middleware /verifyUserToken";
import {deviceMiddleware} from "../middleware /device-middleware";
import {deviceService} from "../domen/device-service";
import {tokenCollectionBlack} from "../db";


const errorFunc = (...args: string[]) => {
    return {
        errorsMessages: args.map(a => ({message: `error at ${a}`, field: a}))
    }
}
export const authRouter = Router({})

authRouter.post('/registration-confirmation', deviceMiddleware, errorsMiddleware,
    async (req: Request, res: Response) => {

        const result = await userService.confirmCode(req.body.code)

        if (result) {
            res.sendStatus(204)
            return
        } else {
            res.status(400).send(errorFunc('code'))
            return
        }

    })

authRouter.post('/registration', deviceMiddleware, userMiddleware, errorsMiddleware, async (req: Request, res: Response) => {

    const user = await userService.createUser(req.body.login, req.body.password, req.body.email)
    if (user) {
        res.sendStatus(204)
        return
    }
})

authRouter.post('/registration-email-resending', deviceMiddleware, errorsMiddleware, async (req: Request, res: Response) => {

        const resendEmail = await userService.createNewEmailConfirmation(req.body.email)
        if (!resendEmail) {
            res.status(400).json(errorFunc('email'))
            return
        } else {
            res.sendStatus(204)
            return
        }



})

authRouter.post('/refresh-token', verifyUserToken, async (req: Request, res: Response) => {
//refreshToken(userId, deviceId)

    const newToken = await jwtService.createJwt(new ObjectId(req.user!.id), req.user?.deviceId!)
    res.cookie('refreshToken', newToken.refreshToken, {httpOnly: true, secure: true})
    return res.status(200).json({accessToken: newToken.accessToken})
})

authRouter.post('/login', deviceMiddleware, authPassMiddleware, errorsMiddleware, async (req: Request, res: Response) => {
    const deviceName = req.headers['user-agent'] || ''
    // const loginIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'undefined'

    const loginUser = await userService.checkCredentials(req.body.loginOrEmail,
        req.body.password)

    if (loginUser) {
        const device = await deviceService.createDevice(req.ip, deviceName)
        const token = await jwtService.createJwt(loginUser._id, device.deviceId)
        res.cookie('refreshToken', token.refreshToken, {httpOnly: true, secure: true})
        res.status(200).json({accessToken: token.accessToken})
    } else {
        res.sendStatus(401)
        return
    }
})

authRouter.post('/logout', verifyUserToken, async (req: Request, res: Response) => {

    await deviceService.deviceGetId(req.user?.deviceId!)
    return res.clearCookie('refreshToken').sendStatus(204)

})

authRouter.get('/me', authBearerMiddleware, async (req: Request, res: Response) => {

    const userMe = await userRepository.getMe()
    return res.status(200).json(userMe)

})