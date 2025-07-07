import * as nodemailer from 'nodemailer';

export interface ScheduledEmail {
  to: string;
  subject: string;
  body: string;
  scheduleTime: Date;
  html: boolean;
  id: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;
  private scheduledEmails: Map<string, NodeJS.Timeout> = new Map();

  constructor(private user?: string, private pass?: string) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: user,
        pass: pass,
      },
    });
  }

  async sendEmail(to: string, subject: string, body: string, html: boolean = false): Promise<void> {
    const mailOptions = {
      from: this.user,
      to,
      subject,
      [html ? 'html' : 'text']: body,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error(`Failed to send email: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async scheduleEmail(
    to: string,
    subject: string,
    body: string,
    scheduleTime: Date,
    html: boolean = false
  ): Promise<ScheduledEmail> {
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
      } catch (error) {
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

  cancelScheduledEmail(id: string): boolean {
    const timeout = this.scheduledEmails.get(id);
    if (timeout) {
      clearTimeout(timeout);
      this.scheduledEmails.delete(id);
      return true;
    }
    return false;
  }

  getScheduledEmails(): ScheduledEmail[] {
    const emails: ScheduledEmail[] = [];
    // Note: In a real implementation, you'd store this data persistently
    return emails;
  }
}
