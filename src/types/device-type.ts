import {ObjectId} from "mongodb";

export type DeviceType = {
    IP: string,
    title: string,
    lastActiveDate: string,
    deviceId: string
}


export type DeviceTypeView = {
    _id: ObjectId,
    IP: string | null,
    URL: string,
    date: Date

}




