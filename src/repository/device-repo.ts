import {devicesCollection} from "../db";
import {DeviceTypeId} from "../types/device-type";


export const deviceRepo = {
    async deviceCreate(newDevice: DeviceTypeId): Promise<DeviceTypeId> {

        const createDeviceDb = await devicesCollection.insertOne(newDevice)

        return {
            userId: createDeviceDb.insertedId.toString(),
            ip: newDevice.ip,
            title: newDevice.title,
            lastActiveDate: newDevice.lastActiveDate,
            deviceId: newDevice.deviceId
        }
    },

    async updateDevice(deviceId: string, userId: string, lastActiveDate: string, title: string) {
        return devicesCollection.findOneAndUpdate({userId}, {$set: {deviceId, lastActiveDate, title}})
    },


    async deleteAllDevice() {
        return devicesCollection.deleteMany({})
    },

    async deleteSession(deviceId: string) {
        const result = await devicesCollection.deleteOne({deviceId})
        return result.deletedCount === 1
    },

    async deleteOtherSession(userId: string, deviceId: string) {
        const delOtSes = await devicesCollection.deleteMany({userId, deviceId: {$ne: deviceId}})
        return delOtSes.deletedCount === 1
    },

    async sessionDevice(deviceId: string) {
        return devicesCollection.findOne({deviceId})
    }


}