import { VideoType } from '@prisma/client';
import prisma from '.';
import { commment, productData, users, video } from '../seedData';
import { getVideoDetails } from '../utils/youtube.util';


const main = async ()=> {
  await prisma.user.create({
    data: {
      email: users[0].email,
      username: users[0].username,
      password: users[0].password,
      profile: {
        create: {
          fullName: users[0].fullName,
          dateOfBirth: users[0].dateOfBirth,
          profilePicUrl: `https://ui-avatars.com/api/?background=random&name=${users[0].username}&color=#fff`,
        },
      },
    },
  });

  const user = await prisma.user.findFirst();
  const videoId = video.videoUrl.split('?v=');
  const thumbnails = await getVideoDetails([videoId[1]]);
  if (user) {
    await prisma.video.create({
      data: {
        title: video.title,
        videoUrl: video.videoUrl,
        videoType: video.videoType === 'LIVE' ? VideoType.LIVE : VideoType.REWATCH,
        creatorId: user.id,
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
  }

  const videoFirst = await prisma.video.findFirst();
  const price = productData[0].discount ? productData[0].price - productData[0].discount / 100 * productData[0].price : productData[0].price;

  if (videoFirst) {
    await prisma.product.create({
      data: {
        title: productData[0].title,
        imageUrl: productData[0].imageUrl,
        price: price,
        originalPrice: productData[0].price,
        discount: productData[0].discount,
        videoId: videoFirst.id,
      },
    });
  }

  if ( videoFirst && user) {
    await prisma.comment.create({
      data: {
        content: commment.content,
        userId: user.id,
        videoId: videoFirst.id,
      },
    });
  }
 

  
};

main()
  .catch((e: any) => {
    console.log(e);
    process.exit();
  }).finally(async () => {
    await prisma.$disconnect();
  });