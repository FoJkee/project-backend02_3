import nodemailer from "nodemailer";

export const emailAdapters = {

    async sendEmail(email: string) {

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'romanovsky0815@gmail.com',
                pass: 'sihdiiqmwudehwza'
            }
        });

        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: 'Viktor <romanovsky0815@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Hello", // Subject line
            text: "hello", // plain text body
            html: "<b>Hello world!</b>", // html body
        });

        return info
    }


}