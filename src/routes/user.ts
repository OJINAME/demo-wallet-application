import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { validate } from '../utils/validators';
import { registerValidators, loginValidators } from '../utils/userValidators';

export const userRouter = (userController: UserController): Router => {
  const router = Router();

  router.post(
    '/register',
    registerValidators,
    validate,
    userController.register.bind(userController)
  );

  router.post(
    '/login',
    loginValidators,
    validate,
    userController.login.bind(userController)
  );

  return router;
};