import { BaseResponse } from '../../interfaces/MessageResponse';
import { NextFunction, Request, Response } from 'express';
import * as UserService from './user.service';
import { UserRequest } from './user.model';

export const findOne = async (req: Request, res: Response<BaseResponse>, next: NextFunction) => {
  try {
    const result = await UserService.findOne(req.params.id);
    res.json({
      code: 200,
      message: 'successfully get user profile',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const createOne = async (req: Request<UserRequest>, res: Response<BaseResponse>, next: NextFunction) => {
  try {
  
    const result = await UserService.createOne(req.body);
    res.json({
      code: 201,
      message: 'successfully create user',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
  