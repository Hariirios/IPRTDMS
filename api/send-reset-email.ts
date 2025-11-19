import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, resetToken } = req.body;

    if (!email || !resetToken) {
        return res.status(400).json({ error: 'Email and reset token are required' });
    }

    try {
        const baseUrl = process.env.VITE_PRODUCTION_URL || 'https://sirtmaankamentalhealth.vercel.app';
        const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

        // Create transporter
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Send email
        await transporter.sendMail({
            from: `"Sirta Maanka Admin" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Password Reset Request - Sirta Maanka Admin',
            html: `
                <h2>Reset Password</h2>
                <p>You requested to reset your password for the Sirta Maanka Admin Panel.</p>
                <p>Click the link below to reset your password (valid for 1 hour):</p>
                <a href="${resetLink}">Reset Password</a>
                <p>If you didn't request this, please ignore this email.</p>
                <p>Best regards,<br>Sirta Maanka Team</p>
            `,
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Failed to send email' });
    }
}
