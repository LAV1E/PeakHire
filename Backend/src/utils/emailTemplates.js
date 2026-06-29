export function getOtpHtml(
  otp,
  purpose = "Verification"
) {
  return `
  <div style="font-family: Arial, sans-serif; padding:20px;">
      <h2>PeakHire</h2>

      <p>Your OTP for ${purpose} is:</p>

      <h1 style="
        letter-spacing:5px;
        color:#2563eb;
      ">
        ${otp}
      </h1>

      <p>
        This OTP will expire in 5 minutes.
      </p>

      <p>
        If you didn't request this,
        please ignore this email.
      </p>
  </div>
  `;
}