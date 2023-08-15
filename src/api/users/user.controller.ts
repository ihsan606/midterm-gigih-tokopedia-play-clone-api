import { BaseResponse } from '../../interfaces/MessageResponse';
import { NextFunction, Request, Response } from 'express';
import * as UserService from './user.service';
import { LoginRequest, UserRequest } from './user.model';
import { removeCookie, setCookie } from '../../utils/setCookie.util';

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
    setCookie(res, 'jwt', result.token);
    res.json({
      code: 201,
      message: 'successfully create user',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
  

export const login = async (req: Request<LoginRequest>, res: Response<BaseResponse>, next: NextFunction) => {
  try {
  
    const result = await UserService.login(req.body);
    setCookie( res, 'jwt', result.token);
    res.json({
      code: 201,
      message: 'successfully login user',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


export const logout = async (req: Request, res: Response, next: NextFunction)=> {
  try {
    await removeCookie(res, 'jwt');
    res.end();
  } catch (error) {
    next(error); 
  }
  
};