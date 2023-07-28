import prisma from '../../prisma';
import { CommentModel, mapToCommentModel } from './comment.model';
import * as VideoService from './../videos/video.service';
import { NotFoundError } from '../../errors/NotFoundError';


export const createOne = async (comment: CommentModel) => {
  await VideoService.findOne(comment.videoId);

  return prisma.comment.create({
    data: comment,
  });
};

export const findAllByVideoId = async (videoId: string) => {
  await VideoService.findOne(videoId);
  
  const comments = await prisma.comment.findMany({
    where: {
      videoId: videoId,
    },
    include: {
      User: true,
    },
  });

  const data = comments.map(mapToCommentModel);

  
  return data;
};

const findOne = async (id: string) => {
  const comment = await prisma.comment.findUnique({
    where: { id: id },
  });
  
  if (!comment) {
    throw new NotFoundError(`Comment with id ${id} not found`);
  }
  
  return comment;
  
};

export const deleteOne = async (id: string) => {
  await findOne(id);
  
  await prisma.comment.delete({
    where: { id: id },
  });
  
};