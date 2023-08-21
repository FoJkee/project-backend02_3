import {ObjectId} from "mongodb";

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

export type DeviceTypeId = { userId: string } & DeviceType_Id

export type DeviceLimitView = {
    _id: ObjectId
    ip: string | string[],
    Url: string,
    date: Date
}


