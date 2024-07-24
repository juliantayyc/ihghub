const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = (email, token) => {
  const msg = {
    to: email,
    from: 'julian.tay@u.nus.edu',
    subject: '[IHG Hub] Email Verification',
    text: `Please verify your email by clicking the following link: ${process.env.VITE_APP_SERVER_URL}/auth/verify-email?token=${token}`,
    html: `
  <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
    <h2 style="color: #333;">Email Verification</h2>
    <p style="color: #666;">Please verify your email by clicking the button below:</p>
    <a href="${process.env.VITE_APP_SERVER_URL}/email-verified?token=${token}" style="display: inline-block; padding: 10px 20px; margin-top: 20px; font-size: 16px; color: white; background-color: #28a745; border-radius: 5px; text-decoration: none;">
      Verify Email
    </a>
    <p style="color: #999; margin-top: 40px;">If you did not sign up for this account, please ignore this email.</p>
  </div>
`,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log('Verification email sent');
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = { sendVerificationEmail };
