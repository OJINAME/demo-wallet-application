"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const errors_1 = require("../utils/errors");
class UserService {
    constructor(db, karmaService, walletService) {
        this.db = db;
        this.karmaService = karmaService;
        this.walletService = walletService;
    }
    generateToken(user) {
        return jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_SECRET || 'default-secret', { expiresIn: '24h' });
    }
    async registerUser(userData) {
        // Check Karma blacklist
        const emailBlacklisted = await this.karmaService.checkKarma(userData.email);
        const phoneBlacklisted = await this.karmaService.checkKarma(userData.phone_number);
        // Determine if the user is blacklisted
        const isBlacklisted = (emailBlacklisted === true) || (phoneBlacklisted === true);
        if (isBlacklisted) {
            throw new errors_1.ApplicationError('User is blacklisted', 403, 'USER_BLACKLISTED');
        }
        const trx = await this.db.transaction();
        try {
            // Hash password
            const salt = await bcryptjs_1.default.genSalt(10);
            const password_hash = await bcryptjs_1.default.hash(userData.password, salt);
            // Generate UUID for new user
            const userId = (0, uuid_1.v4)();
            // Insert user
            await trx('users')
                .insert({
                id: userId,
                email: userData.email,
                phone_number: userData.phone_number,
                password_hash
            });
            // Fetch the newly created user
            const user = await trx('users')
                .where('id', userId)
                .select('id', 'email', 'phone_number')
                .first();
            if (!user) {
                throw new errors_1.ApplicationError('Failed to create user', 500, 'USER_CREATION_FAILED');
            }
            // Create wallet for user
            await this.walletService.createWallet(user.id);
            await trx.commit();
            // Generate JWT
            const token = this.generateToken(user);
            return {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    phone_number: user.phone_number
                }
            };
        }
        catch (error) {
            await trx.rollback();
            // Handle duplicate entry error for MySQL
            if (error.code === 'ER_DUP_ENTRY') {
                throw new errors_1.ApplicationError('Email or phone number already exists', 400, 'DUPLICATE_USER');
            }
            throw error;
        }
    }
    async loginUser(credentials) {
        const user = await this.db('users')
            .where('email', credentials.email)
            .first();
        if (!user) {
            throw new errors_1.ApplicationError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
        }
        const isValidPassword = await bcryptjs_1.default.compare(credentials.password, user.password_hash);
        if (!isValidPassword) {
            throw new errors_1.ApplicationError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
        }
        const token = this.generateToken(user);
        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                phone_number: user.phone_number
            }
        };
    }
    async getUserById(id) {
        const user = await this.db('users')
            .where('id', id)
            .first();
        if (!user)
            return null;
        const { password_hash, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
exports.UserService = UserService;
