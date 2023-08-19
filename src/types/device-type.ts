import {ObjectId, WithId} from "mongodb";

export type DeviceType = {
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId: string
}


export type DeviceType_Id = {
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId: string
}

export type DeviceTypeId = { userId: string } & Omit<DeviceType_Id, '_id'>




