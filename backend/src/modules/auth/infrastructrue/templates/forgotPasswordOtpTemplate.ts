import type { UserRole } from "../../domain/enums/UserRole.ts";

export function forgotPasswordOtpTemplate(
  otp: string,
  role?: UserRole | string,
  expiresInMinutes = 5,
) {
  const roleLabel = role ? ` (${role})` : "";

  return {
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; padding: 28px; background-color: #FAF8F5; border: 1px solid #E7E5E4; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #C85A32; font-size: 24px; margin: 0; font-weight: 800;">MentorFlow</h2>
          <p style="color: #78716C; font-size: 14px; margin-top: 4px;">Account Recovery Security Verification</p>
        </div>
        
        <div style="background-color: #FFFFFF; border: 1px solid #E7E5E4; border-radius: 12px; padding: 24px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          <p style="color: #292524; font-size: 15px; margin-bottom: 16px;">
            We received a request to reset the password for your MentorFlow account${roleLabel}. Use the 6-digit code below to proceed:
          </p>
          <div style="background-color: #FDF2EC; border: 1px dashed #C85A32; border-radius: 8px; padding: 14px 24px; display: inline-block; margin: 12px 0;">
            <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #C85A32; font-family: monospace;">${otp}</span>
          </div>
          <p style="color: #78716C; font-size: 13px; margin-top: 16px;">
            This verification code is valid for <strong>${expiresInMinutes} minutes</strong>.
          </p>
        </div>

        <p style="color: #A8A29E; font-size: 12px; text-align: center; margin-top: 24px; line-height: 1.5;">
          If you did not initiate this password reset, please ignore this email or contact support if you suspect unauthorized access.
        </p>
      </div>
    `,
  };
}
