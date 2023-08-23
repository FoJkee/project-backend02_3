import {devicesCollection} from "../db";
import {DeviceType, DeviceType_Id, DeviceTypeId} from "../types/device-type";
import {da} from "date-fns/locale";


export const deviceRepo = {
    async deviceCreate(newDevice: DeviceTypeId): Promise<DeviceTypeId>{

        const createDeviceDb = await devicesCollection.insertOne(newDevice)

        return {
            userId: createDeviceDb.insertedId.toString(),
            ip: newDevice.ip,
            title: newDevice.title,
            lastActiveDate: newDevice.lastActiveDate,
            deviceId: newDevice.deviceId
        }
    },

    async updateDevice(deviceId: string, data: DeviceTypeId) {
        await devicesCollection.findOneAndUpdate({deviceId}, data)
        return  devicesCollection.findOne({deviceId})
    },






    async deleteAllDevice(){
        return devicesCollection.deleteMany({})
    },


    async deleteSession(deviceId: string){
        const result = await devicesCollection.deleteOne({deviceId})
        return result.deletedCount === 1
    },

    async deleteOtherSession(userId: string, deviceId: string){
        const delOtSes = await devicesCollection.deleteMany({userId, deviceId: {$ne: deviceId}})
        return delOtSes.deletedCount === 1
    },



    async sessionDevice(deviceId: string){
        return devicesCollection.findOne({deviceId})
    }






}