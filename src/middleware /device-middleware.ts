import {NextFunction, Request, Response} from "express";
import {Filter, ObjectId} from "mongodb";
import {devicesCollection} from "../db";


export const deviceMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const newDevice = {
        _id: new ObjectId(),
        IP: req.headers['x-forwarded-for'] || req.socket.remoteAddress || null,
        URL: req.baseUrl || req.originalUrl,
        date: new Date()
    }

    const filter = {
        IP: newDevice.IP,
        URL: newDevice.URL,
        date: {$gte: new Date(Date.now() - 10000)}
    }

    const userApiByIP = await devicesCollection.countDocuments(filter)

    if (userApiByIP > 5) {
        res.status(429).json({errorsMessages: [{message: 'too many request'}]})
        return
    }

   next()
}