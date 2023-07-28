import { ObjectId } from 'mongodb';
import * as z from 'zod';

const tokpedUrlRegex = /^https:\/\/www\.tokopedia\.com\/.+$/;


export const Product = z.object({
  tokpedUrl: z.string().refine((value) => tokpedUrlRegex.test(value), {
    message: 'Invalid Tokopedia Product URL',
  }),
  videoId: z.string(),
});

export const ProductManual = z.object({
  title: z.string(),
  imageUrl: z.string(),
  price: z.number(),
  discount: z.number(),
  videoId: z.string().min(1).refine((val)=> {
    try {
      return new ObjectId(val);
    } catch (error) {
      return false;
    }
  }),
});

export type ProductRequest = z.infer<typeof Product>;
export type ProductManualRequest = z.infer<typeof ProductManual>;
export type ProductModel = {
  id: string;
  title?: string;
  imageUrl?: string;
  price?: number;
  originalPrice?: number;
  discount: number | 0;
  videoId?: string;
};

export const mapToProductModel = (product: any): ProductModel => {
  return {
    id: product.id,
    title: product.title,
    imageUrl: product.imageUrl,
    price: product.price,
    originalPrice: product.originalPrice,
    discount: product.discount,
    videoId: product.videoId,
  };
};