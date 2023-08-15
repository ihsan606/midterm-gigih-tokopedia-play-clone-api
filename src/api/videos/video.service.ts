import { NotFoundError } from '../../errors/NotFoundError';
import prisma from '../../prisma';
import { getVideoDetails } from '../../utils/youtube.util';
import { VideoModel, VideoRequest, mapToVideoModel } from './video.model';
import * as UserService from './../users/user.service';
import { uploadImage } from '../../utils/cloudinary';

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
    include: {
      creator: true,
      thumbnailUrl: true,
    },
  });

  const data = mapToVideoModel(video, '5g');

  if (!video) {
    throw new NotFoundError(`Video with id ${id} not found`);
  }

  return data;
};

export const createOne = async (video: VideoRequest) => {
  await UserService.findOne(video.creatorId);
  const videoNormalId = video.videoUrl.split('?v=');
  const videoShortId = video.videoUrl.split('/shorts/');
  const videoId = videoNormalId.length > 1 ? videoNormalId[1] : videoShortId.length > 1 ? videoShortId[1] : '';
    
  const thumbnails = await getVideoDetails([videoId]);
  const imageDefault = await uploadImage(thumbnails?.thumbnails?.default?.url || '');
  const imageHight = await uploadImage(thumbnails?.thumbnails?.high?.url || '');
  const imageMaxres = await uploadImage(thumbnails?.thumbnails?.maxres?.url || '');
  const imageMedium = await uploadImage(thumbnails?.thumbnails?.medium?.url || '');
  const imageStandart = await uploadImage(thumbnails?.thumbnails?.standard?.url || '');
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  return prisma.video.create({
    data: {
      title: video.title,
      videoUrl: embedUrl,
      videoType: video.videoType,
      creatorId: video.creatorId,
      thumbnailUrl: {
        create: {
          defaultUrl: imageDefault,
          mediumUrl: imageMedium,
          highUrl: imageHight,
          standardUrl: imageStandart,
          maxresUrl: imageMaxres,
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
