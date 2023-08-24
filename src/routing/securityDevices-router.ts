import {Request, Response, Router} from "express";
import {deviceService} from "../domen/device-service";
import {jwtService} from "../application/jwt-service";


export const securityRouter = Router()


securityRouter.get('/', async (req: Request, res: Response) => {

    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(401);

    const dataToken = await jwtService.getUserByRefreshToken(refreshToken);
    if (!dataToken) {
        res.sendStatus(404)
        return
    }

    if (!dataToken.userId && !dataToken.deviceId) return res.sendStatus(401);

    const deviceGet = await deviceService.deviceGet(dataToken.userId)

    return res.status(200).json(deviceGet)

})

securityRouter.delete('/', async (req: Request, res: Response) => {

    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(401);

    const dataToken = await jwtService.getUserByRefreshToken(refreshToken)
    if (!dataToken) return res.sendStatus(401)

    const deleteOtherSession = await deviceService.deleteOtherSession(dataToken.userId, dataToken.deviceId)
    return res.sendStatus(204)

})

securityRouter.delete('/:deviceId', async (req: Request, res: Response) => {

    const deviceId = req.params.deviceId
    const refreshToken = req.cookies.refreshToken

    const dataToken = await jwtService.getUserByRefreshToken(refreshToken)

    if (!dataToken) {
        res.sendStatus(401)
        return
    }

    const dataSession = await deviceService.sessionDevice(deviceId)
    if (!dataSession) {
        res.sendStatus(404)
        return
    }

    if (dataSession && dataSession.userId !== dataToken.userId) {
        res.sendStatus(403)
        return
    }

    const deleteSession = deviceService.deleteSession(deviceId)

    if (!deleteSession) {
        res.sendStatus(404)
        return
    }
    return res.sendStatus(204)

})
