import { google } from 'googleapis';
export class CalendarService {
    constructor(clientId, clientSecret, refreshToken) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.refreshToken = refreshToken;
        if (clientId && clientSecret && refreshToken) {
            this.auth = new google.auth.OAuth2(clientId, clientSecret);
            this.auth.setCredentials({ refresh_token: refreshToken });
            this.calendar = google.calendar({ version: 'v3', auth: this.auth });
        }
    }
    ensureAuthenticated() {
        if (!this.calendar) {
            throw new Error('Google Calendar not configured. Please set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN environment variables.');
        }
    }
    async createEvent(event) {
        this.ensureAuthenticated();
        const calendarEvent = {
            summary: event.summary,
            description: event.description,
            start: {
                dateTime: event.start.toISOString(),
                timeZone: 'UTC',
            },
            end: {
                dateTime: event.end.toISOString(),
                timeZone: 'UTC',
            },
            location: event.location,
            attendees: event.attendees?.map(email => ({ email })),
        };
        try {
            const response = await this.calendar.events.insert({
                calendarId: 'primary',
                resource: calendarEvent,
            });
            return {
                id: response.data.id,
                summary: response.data.summary,
                description: response.data.description,
                start: new Date(response.data.start.dateTime),
                end: new Date(response.data.end.dateTime),
                location: response.data.location,
                attendees: response.data.attendees?.map((attendee) => attendee.email),
            };
        }
        catch (error) {
            throw new Error(`Failed to create calendar event: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async listEvents(startDate, endDate, maxResults = 10) {
        this.ensureAuthenticated();
        const timeMin = startDate ? startDate.toISOString() : new Date().toISOString();
        const timeMax = endDate ? endDate.toISOString() : undefined;
        try {
            const response = await this.calendar.events.list({
                calendarId: 'primary',
                timeMin,
                timeMax,
                maxResults,
                singleEvents: true,
                orderBy: 'startTime',
            });
            return response.data.items.map((item) => ({
                id: item.id,
                summary: item.summary,
                description: item.description,
                start: new Date(item.start.dateTime || item.start.date),
                end: new Date(item.end.dateTime || item.end.date),
                location: item.location,
                attendees: item.attendees?.map((attendee) => attendee.email),
            }));
        }
        catch (error) {
            throw new Error(`Failed to list calendar events: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async updateEvent(eventId, updates) {
        this.ensureAuthenticated();
        const updateData = {};
        if (updates.summary)
            updateData.summary = updates.summary;
        if (updates.description)
            updateData.description = updates.description;
        if (updates.location)
            updateData.location = updates.location;
        if (updates.start) {
            updateData.start = {
                dateTime: updates.start.toISOString(),
                timeZone: 'UTC',
            };
        }
        if (updates.end) {
            updateData.end = {
                dateTime: updates.end.toISOString(),
                timeZone: 'UTC',
            };
        }
        try {
            const response = await this.calendar.events.patch({
                calendarId: 'primary',
                eventId,
                resource: updateData,
            });
            return {
                id: response.data.id,
                summary: response.data.summary,
                description: response.data.description,
                start: new Date(response.data.start.dateTime),
                end: new Date(response.data.end.dateTime),
                location: response.data.location,
                attendees: response.data.attendees?.map((attendee) => attendee.email),
            };
        }
        catch (error) {
            throw new Error(`Failed to update calendar event: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async deleteEvent(eventId) {
        this.ensureAuthenticated();
        try {
            await this.calendar.events.delete({
                calendarId: 'primary',
                eventId,
            });
        }
        catch (error) {
            throw new Error(`Failed to delete calendar event: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
