import { NextFunction, Request, Response } from 'express';
import { BaseResponse } from '../../interfaces/MessageResponse';
import * as VideoService from './video.service';
import { VideoModel, VideoRequest } from './video.model';
import { ParamsWithId } from '../../interfaces/ParamsWithId';


export const findAll = async (req: Request<any, BaseResponse<VideoModel[]>, {}>, res: Response<BaseResponse<VideoModel[]>>, next: NextFunction) => {
  try {
    const connection = req.query.conn ? req.query.conn.toString() : '2g';
    console.log(connection);
    const result = await VideoService.findAll(connection);
    if (result.length > 0) {
      res.json({
        code: 200,
        message: 'successfully list all videos',
        data: result,
      });
    } else {
      res.json({
        code: 200,
        message: 'videos still empty',
        data: result,
      });
    }
    
  } catch (error) {
    next(error);
  }
};

export const findOne = async (req: Request, res: Response<BaseResponse<VideoModel>>, next: NextFunction) => {
  try {
    const result = await VideoService.findOne(req.params.id);
    res.json({
      code: 200,
      message: 'successfully get detail videos',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const createOne = async (req: Request<VideoRequest>, res: Response<BaseResponse<VideoModel>>, next: NextFunction) => {
  try {

    const result = await VideoService.createOne(req.body);
    res.json({
      code: 201,
      message: 'successfully create video',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOne = async (req: Request, res: Response<BaseResponse>, next: NextFunction) => {
  try {
    await VideoService.deleteOne(req.params.id);
    res.json({
      code: 200,
      message: 'successfully delete video',
      data: [],
    });
  } catch (error) {
    next(error);
  }
};

export const updateOne = async (req: Request<ParamsWithId, Response<BaseResponse>, VideoRequest>, res: Response<BaseResponse>, next: NextFunction) => {
  try {
    await VideoService.updateOne(req.params.id, req.body);
    res.json({
      code: 200,
      message: 'successfully update video',
      data: {
        id: req.params.id,
        ...req.body,
      },
    });
  } catch (error) {
    next(error);
  }
};