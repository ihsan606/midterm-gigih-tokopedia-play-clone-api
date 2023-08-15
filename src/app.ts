import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import * as middlewares from './middlewares';
import api from './api';
import MessageResponse from './interfaces/MessageResponse';
import prisma from './prisma';
import { Socket } from 'socket.io';
import { mapToCommentModel } from './api/comments/comment.model';

require('dotenv').config();

const app = express();

const prima = prisma;


app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

export const http = require('http').Server(app);
// set up socket.io and bind it to our
// http server.
const feUrl = process.env.FE_URL || 'https://fe-tokopedia-play-j07gmnu5m-ihsan606.vercel.app';
let io = require('socket.io')(http, {
  cors: {
    origin: feUrl,
  },
});


io.on('connection', (socket: Socket) => {
  console.log('a user connected');
  const userId = socket.handshake.query.userId as string;
  const videoId = socket.handshake.query.videoId as string;
  console.log('ada user baru nih', userId, 'sama video baru', videoId);
  let newData = {};

  socket.on('newComment', async (comment) => {
    if (userId && videoId && comment.comment !== undefined && comment.comment !== '') {
      
      newData = await prisma.comment.create({
        data: {
          content: comment.content,
          userId: userId,
          videoId: videoId,
        },
        include: {
          User: true,
        },
      });
  
      newData = mapToCommentModel(newData);
      
      console.log('New comment:', newData);
      // Broadcast komentar ke semua klien yang terhubung
      io.emit('newComment', newData);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

app.get('/user', async (req, res)=> {
  const users = await prima.user.findMany();
  res.json({
    data: users,
  });
 
});


app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);


export default app;
