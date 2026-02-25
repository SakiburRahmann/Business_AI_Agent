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
     * Sends an email notification.
     */
    async sendEmail(to: string, subject: string, html: string) {
        try {
            const { data, error } = await this.resend.emails.send({
                from: 'OmniiAi <onboarding@resend.dev>', // Replace with verified domain in production
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
