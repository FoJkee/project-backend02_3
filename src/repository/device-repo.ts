import {devicesCollection} from "../db";
import {DeviceType, DeviceType_Id, DeviceTypeId} from "../types/device-type";


export const deviceRepo = {
    async deviceCreate(newDevice: DeviceType_Id): Promise<DeviceTypeId>{
        const createDeviceDb = await devicesCollection.insertOne(newDevice)

        return {
            userId: createDeviceDb.insertedId.toString(),
            ip: newDevice.ip,
            title: newDevice.title,
            lastActiveDate: newDevice.lastActiveDate,
            deviceId: newDevice.deviceId
        }
    },


    async deviceDeleteAllActiveSession(userId: string, deviceId: string){
        const deviceDel = await devicesCollection.deleteMany({userId, deviceId: {$ne: deviceId}})
        return deviceDel.deletedCount === 1
    },

    async deleteAllDevice(){
        return devicesCollection.deleteMany({})
    }






}