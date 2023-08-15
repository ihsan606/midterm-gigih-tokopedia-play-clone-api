const cloudinary = require('cloudinary').v2;
require('dotenv').config(); 


export async function uploadImage(imageUrl: string) {
  let resultUrl;
  cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
  });

  const cropOptions = {
    width: 290,
    height: 470,
  };

  await cloudinary.uploader.upload(imageUrl, {
    transformation: [
      { crop: 'thumb', ...cropOptions },
    ],
  })
    .then((result: any) => {
      resultUrl = result.secure_url;
      return resultUrl;

    })
    .catch((error: any) => {
      console.error('Error:', error);
    });

  console.log(resultUrl, 'ini yang dikirim');

  return resultUrl;

}


