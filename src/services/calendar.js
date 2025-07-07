"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarService = void 0;
var googleapis_1 = require("googleapis");
var CalendarService = /** @class */ (function () {
    function CalendarService(clientId, clientSecret, refreshToken) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.refreshToken = refreshToken;
        if (clientId && clientSecret && refreshToken) {
            this.auth = new googleapis_1.google.auth.OAuth2(clientId, clientSecret);
            this.auth.setCredentials({ refresh_token: refreshToken });
            this.calendar = googleapis_1.google.calendar({ version: 'v3', auth: this.auth });
        }
    }
    CalendarService.prototype.ensureAuthenticated = function () {
        if (!this.calendar) {
            throw new Error('Google Calendar not configured. Please set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN environment variables.');
        }
    };
    CalendarService.prototype.createEvent = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var calendarEvent, response, error_1;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.ensureAuthenticated();
                        calendarEvent = {
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
                            attendees: (_a = event.attendees) === null || _a === void 0 ? void 0 : _a.map(function (email) { return ({ email: email }); }),
                        };
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.calendar.events.insert({
                                calendarId: 'primary',
                                resource: calendarEvent,
                            })];
                    case 2:
                        response = _c.sent();
                        return [2 /*return*/, {
                                id: response.data.id,
                                summary: response.data.summary,
                                description: response.data.description,
                                start: new Date(response.data.start.dateTime),
                                end: new Date(response.data.end.dateTime),
                                location: response.data.location,
                                attendees: (_b = response.data.attendees) === null || _b === void 0 ? void 0 : _b.map(function (attendee) { return attendee.email; }),
                            }];
                    case 3:
                        error_1 = _c.sent();
                        throw new Error("Failed to create calendar event: ".concat(error_1 instanceof Error ? error_1.message : String(error_1)));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CalendarService.prototype.listEvents = function (startDate_1, endDate_1) {
        return __awaiter(this, arguments, void 0, function (startDate, endDate, maxResults) {
            var timeMin, timeMax, response, error_2;
            if (maxResults === void 0) { maxResults = 10; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.ensureAuthenticated();
                        timeMin = startDate ? startDate.toISOString() : new Date().toISOString();
                        timeMax = endDate ? endDate.toISOString() : undefined;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.calendar.events.list({
                                calendarId: 'primary',
                                timeMin: timeMin,
                                timeMax: timeMax,
                                maxResults: maxResults,
                                singleEvents: true,
                                orderBy: 'startTime',
                            })];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response.data.items.map(function (item) {
                                var _a;
                                return ({
                                    id: item.id,
                                    summary: item.summary,
                                    description: item.description,
                                    start: new Date(item.start.dateTime || item.start.date),
                                    end: new Date(item.end.dateTime || item.end.date),
                                    location: item.location,
                                    attendees: (_a = item.attendees) === null || _a === void 0 ? void 0 : _a.map(function (attendee) { return attendee.email; }),
                                });
                            })];
                    case 3:
                        error_2 = _a.sent();
                        throw new Error("Failed to list calendar events: ".concat(error_2 instanceof Error ? error_2.message : String(error_2)));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CalendarService.prototype.updateEvent = function (eventId, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var updateData, response, error_3;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.ensureAuthenticated();
                        updateData = {};
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
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.calendar.events.patch({
                                calendarId: 'primary',
                                eventId: eventId,
                                resource: updateData,
                            })];
                    case 2:
                        response = _b.sent();
                        return [2 /*return*/, {
                                id: response.data.id,
                                summary: response.data.summary,
                                description: response.data.description,
                                start: new Date(response.data.start.dateTime),
                                end: new Date(response.data.end.dateTime),
                                location: response.data.location,
                                attendees: (_a = response.data.attendees) === null || _a === void 0 ? void 0 : _a.map(function (attendee) { return attendee.email; }),
                            }];
                    case 3:
                        error_3 = _b.sent();
                        throw new Error("Failed to update calendar event: ".concat(error_3 instanceof Error ? error_3.message : String(error_3)));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CalendarService.prototype.deleteEvent = function (eventId) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.ensureAuthenticated();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.calendar.events.delete({
                                calendarId: 'primary',
                                eventId: eventId,
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        throw new Error("Failed to delete calendar event: ".concat(error_4 instanceof Error ? error_4.message : String(error_4)));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return CalendarService;
}());
exports.CalendarService = CalendarService;
