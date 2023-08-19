import {Request, Response, Router} from "express";
import {deviceService} from "../domen/device-service";
import {authBearerMiddleware} from "../middleware /authbearer-middleware";


export const securityRouter = Router()


securityRouter.get('/', authBearerMiddleware, async (req: Request, res: Response) => {
    const deviceGet = await deviceService.deviceGet()
    res.status(200).json(deviceGet)

})

securityRouter.delete('/', async (req: Request, res: Response) => {

    return res.sendStatus(204)

})

securityRouter.delete('/:deviceId', async (req: Request, res: Response) => {
    const findDevId = await deviceService.deviceGetId(req.params.deviceId)
    if (!findDevId) {
        res.sendStatus(404)
        return
    }

    // if (req.user!.id !== findDevId.userId) {
    //     res.sendStatus(403)
    // } else {
    //     const deleteDevId = await deviceService.deviceDeleteId(req.params.deviceId)
    //     res.sendStatus(204)
    //     return
    // }
})
