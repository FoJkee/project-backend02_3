import {DeviceType_Id, DeviceTypeId} from "../types/device-type";
import {devicesCollection} from "../db";
import {ObjectId} from "mongodb";
import {randomUUID} from "crypto";
import {deviceRepo} from "../repository/device-repo";
import {promises} from "dns";



export const deviceService = {

    async createDevice(ip: string, title: string, userId: string, deviceId: string):Promise<void> {

        const newDevice = {
            userId,
            ip,
            title,
            lastActiveDate: new Date().toString(),
            deviceId
        }
         await deviceRepo.deviceCreate(newDevice)
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
        return deviceRepo.deviceDeleteAllActiveSession(id, deviceId)
    },

    async deviceDeleteId(deviceId: string) {
        const deviceDelId = await devicesCollection.deleteOne({userId: new ObjectId(deviceId)})
        return deviceDelId.deletedCount === 1

    },

    async updateDevice(deviceId: string, data: DeviceTypeId) {
        return deviceRepo.updateDevice(deviceId, data)
    },

    async deleteSession(deviceId: string){
        return deviceRepo.deleteSession(deviceId)
    }




    // async logout(refreshToken: string): Promise<boolean> {
    //     const userToken = await jwtService.getUserByRefreshToken(refreshToken)
    //     if (!userToken) return false
    //
    //     const userId = await userService.getUserId(new ObjectId(userToken.userId))
    //     if(!userId) return false
    //
    //
    //     const deleted = await this.deviceDeleteId(userToken.deviceId)
    //     return deleted
    //
    // }


}