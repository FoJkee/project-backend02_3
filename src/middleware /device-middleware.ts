import {NextFunction, Request, Response} from "express";
import {limitCollection} from "../db";
import {DeviceLimitView} from "../types/device-type";
import dateFns from 'date-fns/addSeconds'


export const deviceMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const currentDate = new Date();

    const newDevice: DeviceLimitView = {

        ip: req.ip,
        Url: req.baseUrl + req.url || req.originalUrl,
        date: currentDate
    }

    await limitCollection.insertOne(newDevice)

    const filter = {
        ip: newDevice.ip,
        Url: newDevice.Url,
        date: {$gte: dateFns(currentDate, -10)}
    }

    const userApiByIP = await limitCollection.countDocuments(filter)

    if (userApiByIP > 5) {
        res.status(429).json({errorsMessages: [{message: 'too many request'}]})
        return
    }
    next()
}