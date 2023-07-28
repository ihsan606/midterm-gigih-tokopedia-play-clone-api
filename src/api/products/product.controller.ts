import { BaseResponse } from '../../interfaces/MessageResponse';
import { ParamsWithId } from '../../interfaces/ParamsWithId';
import { ProductManualRequest, ProductModel, ProductRequest } from './product.model';
import * as ProductService from './product.service';
import { NextFunction, Request, Response } from 'express';

export const loadProductUrl = async (req: Request, res: Response<BaseResponse>, next: NextFunction) => {
  try {
    const url = req.body.url;
    const productData = await ProductService.loadProductUrl(url);
    res.json({
      code: 200,
      message: 'successfully scrape productUrl',
      data: productData,
    });
  } catch (error) {
    next(error);
  }
};

export const creteOne = async (req: Request<ProductRequest>, res: Response<BaseResponse<ProductModel>>, next: NextFunction) => {
  try {
    const result = await ProductService.createOne(req.body);
    if (result) {
      res.json({
        code: 201,
        message: 'successfully create product',
        data: result,
      });
    }
    
  } catch (error) {
    next(error);
  }
};

export const createOneManualy = async (req: Request<{}, BaseResponse<ProductModel>, ProductManualRequest >, res: Response<BaseResponse<ProductModel>>, next: NextFunction) => {
  try {
    const result = await ProductService.createOneManualy(req.body);
 
    res.json({
      code: 201,
      message: 'successfully create product',
      data: result,
    });
    
  } catch (error) {
    next(error);
  }
};

export const findAllByVideoId = async (req: Request<ParamsWithId>, res: Response<BaseResponse<ProductModel[]>>, next: NextFunction) => {
  try {
    const result = await ProductService.findAllByVideoId(req.params.id);
    res.json({
      code: 200,
      message: 'successfully get all products by video id',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOne = async (req: Request, res: Response<BaseResponse>, next: NextFunction) => {
  try {
    await ProductService.deleteOne(req.params.id);
    res.json({
      code: 200,
      message: 'successfully delete product',
      data: [],
    });
  } catch (error) {
    next(error);
  }
};