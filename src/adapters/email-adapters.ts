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
            subject: "Registration", // Subject line
            text: "Registration", // plain text body
            html: " <h1>Thank for your registration</h1>\n" +
                " <p>To finish registration please follow the link below:\n" +
                "     <a href='https://somesite.com/confirm-email?code=your_confirmation_code'>complete registration</a>\n" +
                " </p>", // html body
        });

        return info
    }


}