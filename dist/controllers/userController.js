"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const errors_1 = require("../utils/errors");
class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async register(req, res) {
        try {
            const userData = req.body;
            const result = await this.userService.registerUser(userData);
            res.status(201).json({
                success: true,
                data: result
            });
        }
        catch (error) {
            if (error instanceof errors_1.ApplicationError) {
                res.status(error.status).json({
                    success: false,
                    error: {
                        code: error.code,
                        message: error.message
                    }
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    error: 'Internal server error'
                });
            }
        }
    }
    async login(req, res) {
        try {
            const credentials = req.body;
            const result = await this.userService.loginUser(credentials);
            res.status(200).json({
                success: true,
                data: result
            });
        }
        catch (error) {
            if (error instanceof errors_1.ApplicationError) {
                res.status(error.status).json({
                    success: false,
                    error: {
                        code: error.code,
                        message: error.message
                    }
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    error: 'Internal server error'
                });
            }
        }
    }
}
exports.UserController = UserController;
