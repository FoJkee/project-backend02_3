import {devicesCollection} from "../db";
import {DeviceTypeView} from "../types/device-type";


export const deviceService = {

    // async deviceGet(): Promise<DeviceTypeView | null> {
    //     const devices = await devicesCollection.findOne()
    //
    //     if (devices) {
    //
    //         return {
    //             IP: devices.IP,
    //             URL: devices.URL,
    //             // deviceId: devices._id.toString()
    //
    //         }
    //     } else {
    //         return null
    //     }
    //
    // },


    // async createDevice(req: Request){
    //
    //     const newDevice = {
    //         _id: ObjectId,
    //         IP: req.headers['x-forwarded-for'] || req.socket.remoteAddress || null,
    //         URL: req.baseUrl,
    //         date: new Date()
    //
    //     }
    //
    // }


}