import nodemailer from 'nodemailer';

export const sendEmail = async (to, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "hazemsaber142@gmail.com", // Replace with your Gmail email address
                pass: "qoidvxtlchnlrykt", // Replace with your Gmail password or app-specific password
            },
        });

        const info = await transporter.sendMail({
            from: '"Your Name" <your-email@gmail.com>',
            to: to,
            subject: subject,
            html: html,
        });

        console.log("Message sent: %s", info.messageId);
        return true; // Email sent successfully
    } catch (error) {
        console.error("Error sending email:", error);
        return false; // Error sending email
    }
};
