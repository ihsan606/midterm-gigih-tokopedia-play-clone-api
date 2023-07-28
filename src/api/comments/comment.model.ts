import * as z from 'zod';


export const Comment = z.object({
  content: z.string(),
  userId: z.string(),
  videoId: z.string(),
});

export type CommentRequest = z.infer<typeof Comment>;

export type CommentModel = {
  id: string;
  content: string;
  userId: string;
  username?: string;
  videoId: string;
};

export const mapToCommentModel = (comment: any): CommentModel => {
  return {
    id: comment.id,
    content: comment.content,
    username: comment.User.username,
    videoId: comment.videoId,
    userId: comment.User.id,
  };
};