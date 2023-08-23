import {Request, Response, Router} from "express";
import {deviceService} from "../domen/device-service";
import {verifyUserToken} from "../middleware /verifyUserToken";
import {jwtService} from "../application/jwt-service";


export const securityRouter = Router()


securityRouter.get('/', verifyUserToken, async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(401);
    const dataToken = await jwtService.getUserByRefreshToken(refreshToken);
    if (!dataToken?.userId && !dataToken?.deviceId) return res.sendStatus(401);

    const deviceGet = await deviceService.deviceGet(dataToken.userId)
    return res.status(200).json(deviceGet)

})

securityRouter.delete('/',verifyUserToken, async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(401);
    const dataToken = await jwtService.getUserByRefreshToken(refreshToken)
    if (!dataToken) return res.sendStatus(401);
    await deviceService.deleteOtherSession(dataToken.userId, dataToken.deviceId)
    return res.sendStatus(204)
})

securityRouter.delete('/:deviceId',verifyUserToken, async (req: Request, res: Response) => {
    const deviceId = req.params.deviceId
    const refreshToken = req.cookies.refreshToken

    const dataToken = await jwtService.getUserByRefreshToken(refreshToken)
    const dataSession = await deviceService.sessionDevice(deviceId)
    if (!dataSession) {
        res.sendStatus(404)
        return
    }
    if (dataSession && dataSession.deviceId !== dataToken!.deviceId) {
        res.sendStatus(403)
        return
    }

    const deleteSession = deviceService.deleteSession(deviceId)
    if (!deleteSession) {
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)

})
