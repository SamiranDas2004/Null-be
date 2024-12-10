import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "rahulgonzalezisme@gmail.com",
    pass: "Samiran@123", // Use the generated app password here
  },
});

const sendVerificationEmail = async (email) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Email Verification",
    text: `Your Event is registered successfully`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending email", error);
  }
};

export default sendVerificationEmail;
