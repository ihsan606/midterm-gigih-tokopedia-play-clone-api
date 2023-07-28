import { BaseResponse } from '../../interfaces/MessageResponse';
import { ParamsWithId } from '../../interfaces/ParamsWithId';
import { CommentModel, CommentRequest } from './comment.model';
import * as CommentService from './comment.service';
import { NextFunction, Request, Response } from 'express';


export const creteOne = async (req: Request<CommentRequest>, res: Response<BaseResponse<CommentModel>>, next: NextFunction) => {
  try {
    const result = await CommentService.createOne(req.body);
    if (result) {
      res.json({
        code: 201,
        message: 'successfully create comment',
        data: result,
      });
    }
      
  } catch (error) {
    next(error);
  }
};

export const findAllByVideoId = async (req: Request<ParamsWithId>, res: Response<BaseResponse<CommentModel[]>>, next: NextFunction) => {
  try {
    const result = await CommentService.findAllByVideoId(req.params.id);
    res.json({
      code: 200,
      message: 'successfully get all products by video id',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOne = async (req: Request<ParamsWithId>, res: Response<BaseResponse>, next: NextFunction) => {
  try {
    await CommentService.deleteOne(req.params.id);
    res.json({
      code: 200,
      message: 'successfully delete comment',
      data: [],
    });
  } catch (error) {
    next(error);
  }
};

