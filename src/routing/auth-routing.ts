import {Request, Response, Router} from "express";
import {jstPayload, jwtService} from "../application/jwt-service";
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
import {deviceRepo} from "../repository/device-repo";
import {randomUUID} from "crypto";


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

    const deviceName = req.headers['user-agent'] || ''
    const refreshToken = req.cookies.refreshToken

    const payload = jstPayload(refreshToken)
    const data = await jwtService.getUserByRefreshToken(refreshToken)

    const user = await userRepository.getUserId(new ObjectId(data!.userId))

    const accessToken = await jwtService.createAccessToken(new ObjectId(user!.id))
    const newRefreshToken = await jwtService.createRefreshToken(new ObjectId(user!.id), payload!.deviceId)

    const newPayload = jstPayload(newRefreshToken)

    await deviceRepo.updateDevice(payload!.deviceId, {
        deviceId: payload!.deviceId,
        userId: user!.id,
        ip: req.ip,
        title: deviceName,
        lastActiveDate: new Date(newPayload!.iat).toISOString()
    })


    res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true})
    res.status(200).json({accessToken: accessToken})
    return

})

authRouter.post('/login', deviceMiddleware, authPassMiddleware, errorsMiddleware, async (req: Request, res: Response) => {

    const deviceName = req.headers['user-agent'] || ''
    const deviceId = randomUUID()

    const loginUser = await userService.checkCredentials(req.body.loginOrEmail,
        req.body.password)

    if (!loginUser) {
        res.sendStatus(401)
        return
    }

    if (loginUser) {
        const accessToken = await jwtService.createAccessToken(loginUser._id)
        const refreshToken = await jwtService.createRefreshToken(loginUser._id, deviceId)

        await deviceService.createDevice(req.ip, deviceName, deviceId)

        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
        res.status(200).json({accessToken: accessToken})
    }
})


authRouter.post('/logout', verifyUserToken, async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    const tokenData = await jwtService.getUserByRefreshToken(refreshToken)
    await deviceService.deleteSession(tokenData!.deviceId)
    return res.clearCookie('refreshToken').sendStatus(204)

})

authRouter.get('/me', authBearerMiddleware, async (req: Request, res: Response) => {
    const user = await userService.getUserId(new ObjectId(req.user!.id))
    if (!user) return res.sendStatus(401)

    const userMe = await userRepository.getMe()
    return res.status(200).json(userMe)

})