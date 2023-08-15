import { NotFoundError } from '../../errors/NotFoundError';
import prisma from '../../prisma';
import { ProductManualRequest, ProductRequest } from './product.model';
import * as VideoService from './../videos/video.service';
import { scrapeProducts } from '../../utils/cheerio.util';

export const loadProductUrl = async (url: string) => {
  const product = await scrapeProducts(url);
  if (product?.price === null) {
    console.log('product false');

    console.log(product);
    return {
      product: null,
      status: false,
    };
  }
  console.log('product true');
  console.log(product);

  return {

    product: product,
    status: true,
  };
};

export const findAllByVideoId = async (videoId: string) => {
  await VideoService.findOne(videoId);

  const products = await prisma.product.findMany({
    where: {
      videoId: videoId,
    },
  });

  return products;
};

export const createOne = async (product: ProductRequest) => {
  await VideoService.findOne(product.videoId);
  const tokpedProduct = await loadProductUrl(product.tokpedUrl);
  if (tokpedProduct.product !== undefined && tokpedProduct.product !== null) {
    return prisma.product.create({
      data: {
        title: tokpedProduct.product.title,
        imageUrl: tokpedProduct.product.imageUrl ?? '',
        productUrl: product.tokpedUrl,
        price: tokpedProduct.product.price ?? 0,
        originalPrice: tokpedProduct.product.originalPrice ?? tokpedProduct.product.price ?? 0,
        discount: tokpedProduct.product.discount ?? 0,
        videoId: product.videoId,
      },
    });
  }

  throw new NotFoundError('Product not found from tokpedUrl');
};

export const createOneManualy = async (product: ProductManualRequest) => {
  await VideoService.findOne(product.videoId);
  const price = product.discount ? product.price - product.discount / 100 * product.price : product.price;
  return prisma.product.create({
    data: {
      title: product.title,
      imageUrl: product.imageUrl,
      productUrl: '',
      discount: product.discount,
      price: price,
      originalPrice: product.price,
      videoId: product.videoId,
    },
  });
};

const findOne = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id: id },
  });

  if (!product) {
    throw new NotFoundError(`Product with id ${id} not found`);
  }

  return product;

};

export const deleteOne = async (id: string) => {
  await findOne(id);

  await prisma.product.delete({
    where: { id: id },
  });

};