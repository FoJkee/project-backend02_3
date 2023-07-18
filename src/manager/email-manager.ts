import {inflate} from "zlib";
import {emailAdapters} from "../adapters/email-adapters";


export const emailManager = {
    async sendEmailRecoveryMes (user: any) {

         await emailAdapters.sendEmail('user.email')

    }

}