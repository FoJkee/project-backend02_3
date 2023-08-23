import {DeviceType_Id, DeviceTypeId} from "../types/device-type";
import {devicesCollection} from "../db";

import {deviceRepo} from "../repository/device-repo";


export const deviceService = {

    async createDevice(userId: string, ip: string, title: string, deviceId: string) {

        const newDevice = {
            userId,
            ip,
            title,
            lastActiveDate: new Date().toString(),
            deviceId
        }

        await deviceRepo.deviceCreate(newDevice);
        return;
    },

    async deviceGet(userId: string): Promise<DeviceType_Id[]> {
console.log('userId:', userId)
        const devices = await devicesCollection.find({userId}).toArray()
console.log('SERVICE:', devices);
        return devices.map(el => ({
            deviceId: el.deviceId,
            ip: el.ip,
            lastActiveDate: el.lastActiveDate,
            title: el.title
        }))

    },


    async sessionDevice(deviceId: string){
        return deviceRepo.sessionDevice(deviceId)
    },

    async deleteSession(deviceId: string){
        return deviceRepo.deleteSession(deviceId)
    },

    async deleteOtherSession(userId: string, deviceId: string){
        return deviceRepo.deleteOtherSession(userId, deviceId)
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