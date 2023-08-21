import {DeviceType_Id, DeviceTypeId} from "../types/device-type";
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

    async deviceGetId(userId: string): Promise<DeviceTypeId | null> {
        const findDevId = await devicesCollection.findOne({_id: new ObjectId(userId)})

        if (findDevId) {
            return {
                userId: findDevId._id.toString(),
                deviceId: findDevId.deviceId,
                ip: findDevId.ip,
                lastActiveDate: new Date().toString(),
                title: findDevId.title
            }
        } else {
            return null
        }

    },

    async deviceDeleteAllActiveSession(id: string, deviceId: string): Promise<boolean> {
        const deviceDel = await devicesCollection.deleteMany({id, deviceId: {$ne: deviceId}})
        return deviceDel.deletedCount === 1
    },

    async deviceDeleteId(id: string): Promise<boolean> {
        const deviceDelId = await devicesCollection.deleteOne({_id: new ObjectId(id)})
        return deviceDelId.deletedCount === 1

    }

}