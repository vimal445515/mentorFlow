import nodemailer from "nodemailer"

import type { IEmailService } from "../../domain/interfaces/IEmailService.ts"
import {signupOtpTemplate, type SignupRole} from '../templates/signupOtpTemplate.ts'
import { forgotPasswordOtpTemplate } from '../templates/forgotPasswordOtpTemplate.ts'
import { injectable } from "inversify"
import type { UserRole } from "../../domain/enums/UserRole.ts"

@injectable()
export class NodemailerEmailService implements IEmailService {
    private transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASSWORD,
        }
    })

    async sendSignupOtp(email: string, otp: string, role: UserRole): Promise<void> {
        await this.transporter.sendMail({
            from:`"MentorFlow" <${process.env.EMAIL_USER}>`,
            to:email,
            subject:`"MentorFlow ${role} - Verify your Email"`,
            html:signupOtpTemplate(otp,role as SignupRole).html
        })
    }
    async sendForgotPasswordOtp(email: string, otp: string, role: UserRole): Promise<void> {
        await this.transporter.sendMail({
            from: `"MentorFlow" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "MentorFlow - Reset Your Password",
            html: forgotPasswordOtpTemplate(otp, role).html,
        });
    }
}