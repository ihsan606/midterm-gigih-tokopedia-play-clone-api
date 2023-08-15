import { NextFunction, Request, Response } from 'express';

import ErrorResponse, { BaseErrorResponse, ZodErrorResponse } from './interfaces/ErrorResponse';
import { ZodError } from 'zod';
import { NotFoundError } from './errors/NotFoundError';
import { RequestValidator } from './interfaces/RequestValidator';
import { AlreadyExistError } from './errors/ExistError';
import { ClientError } from './errors/ClientError';

export const notFound = (req: Request, res: Response, next: NextFunction)=> {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
};


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, req: Request, res: Response<ErrorResponse | ZodErrorResponse | BaseErrorResponse>, next: NextFunction) => {
  if (err instanceof ZodError) {
    res.status(422).json({
      message: 'INVALID_REQUEST',
      error: err.errors,
    });
    return true;
  }
  if ( err instanceof NotFoundError || err instanceof AlreadyExistError || err instanceof ClientError) {
    res.status(err.statusCode).json({
      code: err.statusCode,
      message: err.message,
      data: null,
    });
    return true;
  }



  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
  });
};


export const validateRequest = (validators: RequestValidator) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if ( validators.body) {
        req.body = await validators.body?.parseAsync(req.body);
      }

      if ( validators.params) {
        req.params = await validators.params?.parseAsync(req.params);
      }

      if ( validators.query) {
        req.query = await validators.query?.parseAsync(req.query);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
