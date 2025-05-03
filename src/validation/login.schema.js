"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.login = void 0;
var Joi = require("joi");
exports.login = Joi.object({
    email: Joi.string().min(1).presence('required'),
    password: Joi.string().min(8).required()
});
exports.updatePassword = Joi.object({
    userId: Joi.string().min(1).presence('required'),
    old_password: Joi.string().min(8).required(),
    new_password: Joi.string().min(8).required()
});
