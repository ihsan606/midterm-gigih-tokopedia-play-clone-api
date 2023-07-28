import { Role, VideoType } from '@prisma/client';
import * as z from 'zod';
import { WithId } from '../../interfaces/ModelWithId';

const youtubeUrlRegex =
  /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=([\w-]{11})$/;

export const Video = z.object({
  title: z.string().min(1),
  videoUrl: z.string().refine((value) => youtubeUrlRegex.test(value), {
    message: 'Invalid YouTube video URL',
  }),
  videoType: z.enum([VideoType.LIVE, VideoType.REWATCH]),
  creatorId: z.string(),
});

export type VideoRequest = z.infer<typeof Video>;
export type VideoRequestWithId = WithId<VideoRequest>;

export type VideoModel = {
  id: string;
  title?: string;
  videoUrl?: string;
  thumbnaiUrl?: string | null;
  videoType?: string;
  creatorId?: string;
  creator?: User | null;
  startedAt?: Date | null;
  endedAt?: Date | null;
};

export const mapToVideoModel = (video: any, conn: string): VideoModel => {

  let thumbnailUrl;
  console.log(conn, 'koneksinyaa');
  switch (conn) {
    case 'slow-2g':
    case '2g':
      thumbnailUrl = video.thumbnailUrl?.defaultUrl;
      break;
    case '3g':
      thumbnailUrl = video.thumbnailUrl?.mediumUrl;
      break;
    case '4g':
      thumbnailUrl = video.thumbnailUrl?.highUrl;
      break;
    case '5g':
      thumbnailUrl = video.thumbnailUrl?.maxresUrl;
      break;
    default:
      thumbnailUrl = video.thumbnailUrl?.defaultUrl;
  }
  return {
    id: video.id,
    title: video.title,
    videoUrl: video.videoUrl,
    thumbnaiUrl: thumbnailUrl ?? null,
    videoType: video.videoType,
    creatorId: video.creatorId,
    creator: {
      id: video.creatorId,
      username: video.creator.name,
      role: video.creator.role,     
    },
    startedAt: video.startedAt,
    endedAt: video.endedAt,
  };
};

export type User = {
  id: string;
  username: string | null;
  role: Role;
};
