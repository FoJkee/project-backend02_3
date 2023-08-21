import {Request, Response, Router} from "express";
import {deviceService} from "../domen/device-service";
import {verifyUserToken} from "../middleware /verifyUserToken";


export const securityRouter = Router()


securityRouter.get('/', verifyUserToken, async (req: Request, res: Response) => {
    const deviceGet = await deviceService.deviceGet()
   return  res.status(200).json(deviceGet)

})

securityRouter.delete('/', verifyUserToken, async (req: Request, res: Response) => {
await deviceService.deviceDeleteAllActiveSession(req.user?.id! ,req.user?.deviceId!)
    return res.sendStatus(204)

})

securityRouter.delete('/:deviceId', verifyUserToken, async (req: Request, res: Response) => {
    const findDevId = await deviceService.deviceGetId(req.params.deviceId)
    if (!findDevId) {
        res.sendStatus(404)
        return
    }

    if (req.user!.id !== findDevId.userId) {
        res.sendStatus(403)
    } else {
        const deleteDevId = await deviceService.deviceDeleteId(req.params.deviceId)
        res.sendStatus(204)
        return
    }
})
