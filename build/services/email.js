import * as nodemailer from 'nodemailer';
export class EmailService {
    constructor(user, pass) {
        this.user = user;
        this.pass = pass;
        this.scheduledEmails = new Map();
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: user,
                pass: pass,
            },
        });
    }
    async sendEmail(to, subject, body, html = false) {
        const mailOptions = {
            from: this.user,
            to,
            subject,
            [html ? 'html' : 'text']: body,
        };
        try {
            await this.transporter.sendMail(mailOptions);
        }
        catch (error) {
            throw new Error(`Failed to send email: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async scheduleEmail(to, subject, body, scheduleTime, html = false) {
        const now = new Date();
        const delay = scheduleTime.getTime() - now.getTime();
        if (delay <= 0) {
            throw new Error('Schedule time must be in the future');
        }
        const id = Math.random().toString(36).substr(2, 9);
        const timeout = setTimeout(async () => {
            try {
                await this.sendEmail(to, subject, body, html);
                this.scheduledEmails.delete(id);
                console.error(`Scheduled email sent to ${to}`);
            }
            catch (error) {
                console.error(`Failed to send scheduled email: ${error}`);
                this.scheduledEmails.delete(id);
            }
        }, delay);
        this.scheduledEmails.set(id, timeout);
        return {
            id,
            to,
            subject,
            body,
            scheduleTime,
            html,
        };
    }
    cancelScheduledEmail(id) {
        const timeout = this.scheduledEmails.get(id);
        if (timeout) {
            clearTimeout(timeout);
            this.scheduledEmails.delete(id);
            return true;
        }
        return false;
    }
    getScheduledEmails() {
        const emails = [];
        // Note: In a real implementation, you'd store this data persistently
        return emails;
    }
}
