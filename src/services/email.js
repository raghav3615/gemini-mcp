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
exports.EmailService = void 0;
var nodemailer = require("nodemailer");
var EmailService = /** @class */ (function () {
    function EmailService(user, pass) {
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
    EmailService.prototype.sendEmail = function (to_1, subject_1, body_1) {
        return __awaiter(this, arguments, void 0, function (to, subject, body, html) {
            var mailOptions, error_1;
            var _a;
            if (html === void 0) { html = false; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        mailOptions = (_a = {
                                from: this.user,
                                to: to,
                                subject: subject
                            },
                            _a[html ? 'html' : 'text'] = body,
                            _a);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.transporter.sendMail(mailOptions)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        throw new Error("Failed to send email: ".concat(error_1 instanceof Error ? error_1.message : String(error_1)));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    EmailService.prototype.scheduleEmail = function (to_1, subject_1, body_1, scheduleTime_1) {
        return __awaiter(this, arguments, void 0, function (to, subject, body, scheduleTime, html) {
            var now, delay, id, timeout;
            var _this = this;
            if (html === void 0) { html = false; }
            return __generator(this, function (_a) {
                now = new Date();
                delay = scheduleTime.getTime() - now.getTime();
                if (delay <= 0) {
                    throw new Error('Schedule time must be in the future');
                }
                id = Math.random().toString(36).substr(2, 9);
                timeout = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                    var error_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, this.sendEmail(to, subject, body, html)];
                            case 1:
                                _a.sent();
                                this.scheduledEmails.delete(id);
                                console.error("Scheduled email sent to ".concat(to));
                                return [3 /*break*/, 3];
                            case 2:
                                error_2 = _a.sent();
                                console.error("Failed to send scheduled email: ".concat(error_2));
                                this.scheduledEmails.delete(id);
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); }, delay);
                this.scheduledEmails.set(id, timeout);
                return [2 /*return*/, {
                        id: id,
                        to: to,
                        subject: subject,
                        body: body,
                        scheduleTime: scheduleTime,
                        html: html,
                    }];
            });
        });
    };
    EmailService.prototype.cancelScheduledEmail = function (id) {
        var timeout = this.scheduledEmails.get(id);
        if (timeout) {
            clearTimeout(timeout);
            this.scheduledEmails.delete(id);
            return true;
        }
        return false;
    };
    EmailService.prototype.getScheduledEmails = function () {
        var emails = [];
        // Note: In a real implementation, you'd store this data persistently
        return emails;
    };
    return EmailService;
}());
exports.EmailService = EmailService;
