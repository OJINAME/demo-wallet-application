import { Knex } from 'knex';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { User, UserCreationDTO, LoginDTO, AuthResponse } from '../types';
import { KarmaService } from './karmaService';
import { WalletService } from './walletService';
import { ApplicationError } from '../utils/errors';

export class UserService {
  constructor(
    private readonly db: Knex,
    private readonly karmaService: KarmaService,
    private readonly walletService: WalletService
  ) {}

  private generateToken(user: User): string {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email 
      },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    );
  }

  async registerUser(userData: UserCreationDTO): Promise<AuthResponse> {
    console.log('starting')
    // Check Karma blacklist
    const emailBlacklisted = await this.karmaService.checkKarma(userData.email);
    const phoneBlacklisted = await this.karmaService.checkKarma(userData.phone_number);

    // Determine if the user is blacklisted
    const isBlacklisted = (emailBlacklisted === true) || (phoneBlacklisted === true);

    console.log('finished karma check, starting user creation')

    if (isBlacklisted) {
      throw new ApplicationError('User is blacklisted', 403, 'USER_BLACKLISTED');
    }

    const trx = await this.db.transaction();

    try {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(userData.password, salt);

      // Generate UUID for new user
      const userId = uuidv4();

      console.log('user creation - 1')
      // Insert user
      await trx('users')
        .insert({
          id: userId,
          email: userData.email,
          phone_number: userData.phone_number,
          password_hash
        });

        console.log('user creation - 2')

      // Fetch the newly created user
      const user = await trx('users')
        .where('id', userId)
        .select('id', 'email', 'phone_number')
        .first();

        console.log('user creation - 3')

      if (!user) {
        throw new ApplicationError('Failed to create user', 500, 'USER_CREATION_FAILED');
      }

      // Create wallet for user
      await this.walletService.createWallet(user.id, trx);

      console.log('user creation - 4')

      await trx.commit();

      console.log('user creation - 5')

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
    } catch (error) {
      await trx.rollback();
      
      // Handle duplicate entry error for MySQL
      if ((error as any).code === 'ER_DUP_ENTRY') {
        throw new ApplicationError('Email or phone number already exists', 400, 'DUPLICATE_USER');
      }
      
      throw error;
    }
  }

  async loginUser(credentials: LoginDTO): Promise<AuthResponse> {
    const user = await this.db('users')
      .where('email', credentials.email)
      .first();

    if (!user) {
      throw new ApplicationError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    const isValidPassword = await bcrypt.compare(
      credentials.password,
      user.password_hash
    );

    if (!isValidPassword) {
      throw new ApplicationError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
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

  async getUserById(id: string): Promise<Omit<User, 'password_hash'> | null> {
    const user = await this.db('users')
      .where('id', id)
      .first();

    if (!user) return null;

    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
