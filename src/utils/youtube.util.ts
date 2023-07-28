import { google } from 'googleapis';
import { NotFoundError } from '../errors/NotFoundError';

export async function getVideoDetails(videoIds: string[]) {
  try {
    const youtube = google.youtube({
      version: 'v3',
      auth: process.env.GOOGLE_API_KEY,
    });
  
    const response = await youtube.videos.list({
      id: videoIds,
      part: ['snippet', 'statistics'],
    });
  
    const video = response.data.items ? response.data.items[0] : null;
    if (!video) {
      throw new NotFoundError('Youtube video not found');
    }

   
    const data = {
      title: video.snippet?.title,
      thumbnails: video.snippet?.thumbnails,
      viewCount: video.statistics?.viewCount,
      likeCount: video.statistics?.likeCount,
    };

    return data;
   
    
  } catch (error) {
    console.error('Error:', error);
  }
}