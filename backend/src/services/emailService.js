import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const approveEmail = async (agentEmail, agentName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: agentEmail,
    subject: "Tahniah, Pendaftaran Ejen Anda Telah Diluluskan",
    html: `<div style="font-family: sans-serif; line-height: 1.5;">
                <h3>Tahniah ${agentName}!</h3>
                <p>Permohonan akaun ejen anda telah diluluskan.</p>
                <p>Sila log masuk ke aplikasi mudah alih anda sekarang untuk memulakan tugasan.</p>
                <br>
                <p>Terima kasih,<br>Synergy Realty</p>
            </div>`,
  };
  return transporter.sendMail(mailOptions);
};
