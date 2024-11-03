import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { ApplicationError } from '../utils/errors';

export class UserController {
  constructor(private readonly userService: UserService) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;
      const result = await this.userService.registerUser(userData);
      res.status(201).json({ 
        success: true, 
        data: result 
      });
    } catch (error) {
      if (error instanceof ApplicationError) {
        res.status(error.status).json({ 
          success: false, 
          error: {
            code: error.code,
            message: error.message
          }
        });
      } else {
        res.status(500).json({ 
          success: false, 
          error: 'Internal server error' 
        });
      }
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const credentials = req.body;
      const result = await this.userService.loginUser(credentials);
      res.status(200).json({ 
        success: true, 
        data: result 
      });
    } catch (error) {
      if (error instanceof ApplicationError) {
        res.status(error.status).json({ 
          success: false, 
          error: {
            code: error.code,
            message: error.message
          }
        });
      } else {
        res.status(500).json({ 
          success: false, 
          error: 'Internal server error' 
        });
      }
    }
  }
}
