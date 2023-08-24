import {NextFunction, Request, Response} from "express";
import {ObjectId} from "mongodb";
import {limitCollection} from "../db";
import {DeviceLimitView} from "../types/device-type";


export const deviceMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const currentDate = new Date();
    const newDevice: DeviceLimitView = {
        _id: new ObjectId(),
        ip: req.ip,
        Url: req.baseUrl + req.url || req.originalUrl,
        date: new Date()
    }

    await limitCollection.insertOne(newDevice)

    const filter = {
        ip: newDevice.ip,
        Url: newDevice.Url,
        date: {$gte: new Date(Date.now() - 10000)}
    }

    const userApiByIP = await limitCollection.countDocuments(filter)

    if (userApiByIP > 5) {
        res.status(429).json({errorsMessages: [{message: 'too many request'}]})

    }
    next()
}