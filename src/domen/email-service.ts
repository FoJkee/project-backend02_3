import {emailManager} from "../manager/email-manager";


export const emailService = {

    async do(){

        await emailManager.sendEmailRecoveryMes({})
    }

}