"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const validators_1 = require("../utils/validators");
const userValidators_1 = require("../utils/userValidators");
const userRouter = (userController) => {
    const router = (0, express_1.Router)();
    router.post('/register', userValidators_1.registerValidators, validators_1.validate, userController.register.bind(userController));
    router.post('/login', userValidators_1.loginValidators, validators_1.validate, userController.login.bind(userController));
    return router;
};
exports.userRouter = userRouter;
