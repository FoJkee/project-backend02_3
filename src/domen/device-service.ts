import {DeviceType, DeviceType_Id, DeviceTypeId} from "../types/device-type";
import {devicesCollection} from "../db";
import {ObjectId} from "mongodb";
import {randomUUID} from "crypto";
import {deviceRepo} from "../repository/device-repo";




export const deviceService = {

    async createDevice(ip: string, title: string) {
        const deviceId = randomUUID()

         // const tokens //jwtService.createTokens
        // const lastActiveDate // jwtService.decode(tokens.refreshToken) 1578514
        //
        // const tokens = await jwtService.createJwt(new ObjectId(id), token)
        // const lastActiveDate = await jwtService.getDeviceRefreshToken(tokens.refreshToken)

        const newDevice: DeviceType_Id = {
            deviceId,
            ip,
            lastActiveDate: new Date().toString(),
            title
        }
        return await deviceRepo.deviceCreate(newDevice)
    },

    async deviceGet(): Promise<DeviceType_Id[]> {

        const devices = await devicesCollection.find({}).toArray()

            return devices.map(el => ({
                deviceId: el.deviceId,
                ip: el.ip,
                lastActiveDate: el.lastActiveDate,
                title: el.title
            }))

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