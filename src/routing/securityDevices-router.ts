import {Request, Response, Router} from "express";
import {deviceService} from "../domen/device-service";
import {authBearerMiddleware} from "../middleware /authbearer-middleware";


export const securityRouter = Router()


securityRouter.get('/devices', authBearerMiddleware, async (req: Request, res: Response) => {
    const deviceGet = await deviceService.deviceGet()
    res.status(200).json(deviceGet)

})

securityRouter.delete('/devices', async (req: Request, res: Response) => {


})

securityRouter.delete('/devices/:deviceId', async (req: Request, res: Response) => {


})
