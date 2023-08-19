import {UserTypeId} from "./user-type";


declare global {
    declare namespace Express {
        export interface Request {
            user: UserTypeId |null
        }
    }
}
