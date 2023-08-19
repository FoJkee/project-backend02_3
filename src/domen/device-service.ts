import {DeviceType, DeviceType_Id, DeviceTypeId} from "../types/device-type";
import {devicesCollection} from "../db";
import {ObjectId} from "mongodb";
import {randomUUID} from "crypto";
import {deviceRepo} from "../repository/device-repo";


export const deviceService = {

    async createDevice(ip: string, title: string) {
        const newDevice: DeviceType_Id = {
            ip,
            title,
            lastActiveDate: new Date().toISOString(),
            deviceId: randomUUID(),
        }
        return deviceRepo.deviceCreate(newDevice)
    },

    async deviceGet(): Promise<DeviceType_Id | null> {

        const devices = await devicesCollection.findOne()

        if (devices) {

            return {
                ip: devices.ip,
                title: devices.title,
                lastActiveDate: new Date().toISOString(),
                deviceId: devices._id.toString()
            }
        } else {
            return null
        }
    },


    async deviceGetId(id: string): Promise<DeviceTypeId | null> {
        const findDevId = await devicesCollection.findOne({_id: new ObjectId(id)})

        if (findDevId) {
            return {

                userId: findDevId._id.toString(),
                ip: findDevId.ip,
                title: findDevId.title,
                lastActiveDate: new Date().toISOString(),
                deviceId: findDevId.deviceId
            }
        } else {
            return null
        }

    },

    async deviceDeleteAllActiveSession(userId: string, deviceId: string): Promise<boolean> {
        const deviceDel = await devicesCollection.deleteMany({userId, deviceId: {$ne: deviceId}})
        return deviceDel.deletedCount === 1
    },

    async deviceDeleteId(id: string): Promise<boolean> {
        const deviceDelId = await devicesCollection.deleteOne({_id: new ObjectId(id)})
        return deviceDelId.deletedCount === 1

    }

}