
'use server';

import nodemailer from 'nodemailer';

type MailOptions = {
    to: string;
    subject: string;
    text: string;
    html: string;
}

export async function sendEmail(options: MailOptions) {
    const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM } = process.env;

    if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS || !EMAIL_FROM) {
        console.error("Missing email environment variables. Cannot send email.");
        return { success: false, message: 'Server is not configured for sending emails.' };
    }

    const transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: parseInt(EMAIL_PORT, 10),
        secure: parseInt(EMAIL_PORT, 10) === 465, // true for 465, false for other ports
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        },
    });

    try {
        await transporter.sendMail({
            from: `"Chohan Space Assistant" <${EMAIL_FROM}>`,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
        });
        return { success: true, message: 'Email sent successfully.' };
    } catch (error) {
        console.error('Failed to send email:', error);
        return { success: false, message: 'Failed to send email.' };
    }
}
