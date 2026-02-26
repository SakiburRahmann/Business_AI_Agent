import { Resend } from 'resend';

/**
 * NotificationService: Handles outgoing communications like Email (via Resend).
 */
export class NotificationService {
    private resend: Resend;

    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
    }

    /**
     * Sends a professional verification email with a 6-digit code.
     */
    async sendVerificationCode(to: string, code: string, firstName: string) {
        try {
            const { data, error } = await this.resend.emails.send({
                from: 'OmniiAi <onboarding@resend.dev>', // Should be a verified domain in prod
                to,
                subject: `${code} is your OmniiAi verification code`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #111;">
                        <h2 style="color: #6d28d9; font-size: 24px; font-weight: 800; margin-bottom: 24px;">OmniiAi</h2>
                        <p style="font-size: 16px; line-height: 24px;">Hello ${firstName},</p>
                        <p style="font-size: 16px; line-height: 24px;">Welcome to OmniiAi. Please use the following code to verify your email address and complete your registration:</p>
                        <div style="background: #f4f4f5; border-radius: 12px; padding: 24px; text-align: center; margin: 32px 0;">
                            <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #000;">${code}</span>
                        </div>
                        <p style="font-size: 14px; color: #71717a; margin-top: 32px;">
                            This code will expire in 10 minutes. If you didn't request this, you can safely ignore this email.
                        </p>
                        <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 32px 0;" />
                        <p style="font-size: 12px; color: #a1a1aa; text-align: center;">
                            &copy; 2026 OmniiAi Business Systems. All rights reserved.
                        </p>
                    </div>
                `,
            });

            if (error) {
                console.error('[Resend Error]:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('[Notification Error]:', error);
            throw new Error('Failed to send verification email.');
        }
    }

    /**
     * Sends a generic email notification.
     */
    async sendEmail(to: string, subject: string, html: string) {
        try {
            const { data, error } = await this.resend.emails.send({
                from: 'OmniiAi <onboarding@resend.dev>',
                to,
                subject,
                html,
            });

            if (error) {
                console.error('[Resend Error]:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('[Notification Error]:', error);
            throw new Error('Failed to send email notification.');
        }
    }
}
