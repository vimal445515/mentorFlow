
export type SignupRole = "STUDENT" | "MENTOR";

export function signupOtpTemplate(
  otp: string,
  role: SignupRole,
  expiresInMinutes = 5,
) {
  const roleLabel = role === "MENTOR" ? "Mentor" : "Student";

  return {
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>MentorFlow</h2>
        <p>Your ${roleLabel} verification OTP is:</p>
        <h1 style="letter-spacing: 6px;">${otp}</h1>
        <p>This OTP expires in ${expiresInMinutes} minutes.</p>
        <p>If you didn't request this code, ignore this email.</p>
      </div>
    `,
  };
}
