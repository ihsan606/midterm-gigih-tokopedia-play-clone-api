import { NotFoundError } from '../../errors/NotFoundError';
import prisma from '../../prisma';
import { getVideoDetails } from '../../utils/youtube.util';
import { VideoModel, VideoRequest, mapToVideoModel } from './video.model';
import * as UserService from './../users/user.service';

export const findAll =  async (conn: string): Promise<VideoModel[]> => {
  const videos = await prisma.video.findMany({
    include: {
      creator: true,
      thumbnailUrl: true,
    },
  });

  const data = videos.map((video)=> mapToVideoModel(video, conn));

  return data;
};

export const findOne = async (id: string): Promise<VideoModel> => {
  const video = await prisma.video.findUnique({
    where: { id: id },
  });

  if (!video) {
    throw new NotFoundError(`Video with id ${id} not found`);
  }

  return video;
};

export const createOne = async (video: VideoRequest) => {
  await UserService.findOne(video.creatorId);
  const videoId = video.videoUrl.split('?v=');
  const thumbnails = await getVideoDetails([videoId[1]]);
  return prisma.video.create({
    data: {
      ...video,
      thumbnailUrl: {
        create: {
          defaultUrl: thumbnails?.thumbnails?.default?.url,
          mediumUrl: thumbnails?.thumbnails?.medium?.url,
          highUrl: thumbnails?.thumbnails?.high?.url,
          standardUrl: thumbnails?.thumbnails?.standard?.url,
          maxresUrl: thumbnails?.thumbnails?.maxres?.url,
        },
      },
    },
  });
};

export const updateOne = async (id: string, video: VideoRequest) => {
  await findOne(id);

  await prisma.video.update({
    where: { id: id },
    data: video,
  });
};

export const deleteOne = async (id: string) => {
  await findOne(id);
  await prisma.youtubeMedia.deleteMany({
    where: { videoId: id },
  });

  await prisma.video.delete({
    where: { id: id },
  });
};
