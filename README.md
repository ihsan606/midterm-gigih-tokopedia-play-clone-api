## 🧐 About

This project is a Tokopedia Play Clone developed using Node.js, Express, TypeScript, and MongoDB Database.

## 🏁 Features

The application boasts several notable features:

1. Displaying video thumbnails based on the user's internet connection speed.
    - Endpoint: `localhost:3000/api/v1/videos/conn=2g`
    - Parameter: `conn` (values: `2g`, `3g`, `4g`, `5g`)
    - Response: Varies image quality based on the selected `conn`.


2. Create Product by Tokopedia Detail Product URL.
    - Endpoint: `POST localhost:3000/api/v1/products`
    - Request Body:
      ```json
      {
          "tokpedUrl": "https://www.tokopedia.com/philips-estore/philips-digital-rice-cooker-hd4515-90-foodcontainer",
          "videoId": "64c1cdb7f0432ed509593468"
      }
      ```
    - Description: To create a product, provide the Tokopedia product detail URL (`tokpedUrl`) and its related video ID (`videoId`).



## Architecture
![architecture.png](readme-assets%2Farchitecture.png)
![domain-model.png](readme-assets%2Fdomain-model.png)
## Database Stucture

```
model User {
  id        String    @id @default(auto()) @map("_id") @db.ObjectId
  email     String    @unique
  username  String    @unique
  role      Role      @default(USER)
  password  String
  createdAt DateTime? @default(now())
  profile   Profile?
  videos    Video[]
  Comment   Comment[]
}
```

```
model Profile {
  id            String    @id @default(auto()) @map("_id") @db.ObjectId
  fullName      String
  profilePicUrl String?
  dateOfBirth   String
  createdAt     DateTime? @default(now())
  user          User      @relation(fields: [userId], references: [id])
  userId        String    @unique @db.ObjectId
}
```

```
model Video {
  id           String        @id @default(auto()) @map("_id") @db.ObjectId
  title        String
  videoUrl     String
  thumbnailUrl YoutubeMedia?
  videoType    VideoType     @default(LIVE)
  creator      User          @relation(fields: [creatorId], references: [id])
  creatorId    String        @db.ObjectId
  startedAt    DateTime?     @default(now())
  endedAt      DateTime?
  comments     Comment[]
  products     Product[]
}
```

```
model YoutubeMedia {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  defaultUrl  String?
  mediumUrl   String?
  highUrl     String?
  standardUrl String?
  maxresUrl   String?
  video       Video    @relation(fields: [videoId], references: [id])
  videoId     String   @unique @db.ObjectId
  createdAt   DateTime @default(now())
}
```

```
model Product {
  id            String   @id @default(auto()) @map("_id") @db.ObjectId
  title         String
  imageUrl      String
  price         Float
  originalPrice Float
  discount      Float    @default(0)
  Video         Video    @relation(fields: [videoId], references: [id])
  videoId       String   @db.ObjectId
  createdAt     DateTime @default(now())
}
```

```
model Comment {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  content   String
  User      User     @relation(fields: [userId], references: [id])
  userId    String   @db.ObjectId
  Video     Video?   @relation(fields: [videoId], references: [id])
  videoId   String   @db.ObjectId
  createdAt DateTime @default(now())
}
```


## 🏁 Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them.

```
- Nodejs version 16
- Docker for running database 
 (Prisma-Mongodb require database replica set for transactions)
```

### Installing

1. Clone Project
```bash
git clone https://github.com/ihsan606/midterm-gigih-tokopedia-play-clone-api.git
cd midterm-gigih-tokopedia-play-clone-api
```
2. Create a new file .env and copy the content from .env.example. This file will contain environment-specific configurations for the project. Make sure to update any necessary values in the .env file to match your setup.


3. Ensure that your local Docker is active.

4. Run the MongoDB container:
   The MongoDB container will run on localhost:27017. To avoid port conflicts, make sure you have turned off the MongoDB service on your local computer.
```bash
make dc-up-mongodb
# It will run docker compose up mongodb -d
# you can find this configuration in Makefile
```
4. Install dependencies
```bash
npm install
```
5. Init database schema
```bash
npx prisma db push
```
it will generate collections based on prisma schema in `src/prisma/schema.prisma`
6. Run seeder
```bash
npx prisma db seed
```
7. Run
```bash 
npm run dev
```
it will run application at localhost:3000
## API SPEC <a name="api_spect"></a>
### Video API Documentation

This document provides detailed information on the Video API endpoints, which allows you to manage video data in the system.

### ---Get All Videos---
Get all videos

### Request

**Method:** GET

**Endpoint:** `localhost:3000/api/v1/videos?conn=2g`

**Query Params:**
- `conn`: 2g / 3g /4g : it means how internet connection of client

### Example Request

```bash
curl --location 'localhost:3000/api/v1/videos?conn=2g'
```
### Example Response
``` 
{
    "code": 200,
    "message": "successfully list all videos",
    "data": [
        {
            "id": "64be23e40aef23a4a68cacef",
            "title": "magic com mahal",
            "videoUrl": "https://www.youtube.com/watch?v=lvETcAmfYoA",
            "thumbnaiUrl": "https://i.ytimg.com/vi/lvETcAmfYoA/default.jpg",
            "videoType": "REWATCH",
            "creatorId": "64bd66be2a88d0c6c416ed87",
            "creator": {
                "id": "64bd66be2a88d0c6c416ed87",
                "name": "ihsan",
                "role": "USER"
            },
            "startedAt": "2023-07-24T07:10:26.190Z",
            "endedAt": null
        }
    ]
}
```


### ---Get Video Detail---
Get detail of a specific video based on its unique ID.

### Request

**Method:** GET

**Endpoint:** `localhost:3000/api/v1/videos/:id`

**PATH VARIABLES:**
- `id`: The unique ID of the video to be updated. For example: `64c1cdb7f0432ed509593468`


### Example Request

```bash
curl --location 'localhost:3000/api/v1/videos/64c0d7161bc935d5497a48eb'
```
### Example Response
``` 
{
    "code": 200,
    "message": "successfully get detail videos",
    "data": {
        "id": "64c0d7161bc935d5497a48eb",
        "title": "magic com philips lagi",
        "videoUrl": "https://www.youtube.com/watch?v=ZNvFdcjmSds",
        "videoType": "LIVE",
        "creatorId": "64c0cd9161bba9ee29e2f7d8",
        "startedAt": "2023-07-26T08:19:34.726Z",
        "endedAt": null
    }
}
```

### ---Create Video---
Create a video by input specific data

### Request
**Method:** POST

**Headers:**
- `Content-Type`: application/json

**Body:**
```json
{
  "title": "magic com philips lagi",
  "videoUrl": "https://www.youtube.com/watch?v=ZNvFdcjmSds",
  "videoType": "LIVE",
  "creatorId": "64c0cd9161bba9ee29e2f7d8"
}
```

### Example Request

```bash
curl --location 'localhost:3000/api/v1/videos' \
--data '{
    "title": "magic com philips lagi",
    "videoUrl": "https://www.youtube.com/watch?v=ZNvFdcjmSds",
    "videoType": "LIVE",
    "creatorId": "64c0cd9161bba9ee29e2f7d8"
}'

```
### Example Response
``` 
{
    "code": 201,
    "message": "successfully create video",
    "data": {
        "id": "64c1cdb7f0432ed509593468",
        "title": "magic com philips lagi",
        "videoUrl": "https://www.youtube.com/watch?v=ZNvFdcjmSds",
        "videoType": "LIVE",
        "creatorId": "64c0cd9161bba9ee29e2f7d8",
        "startedAt": "2023-07-27T01:51:51.513Z",
        "endedAt": null
    }
}
```

### ---Update Video by ID---

Updates the details of a specific video based on its unique ID.

### Request

**Method:** PUT

**Endpoint:** `localhost:3000/api/v1/videos/:id`

**PATH VARIABLES:**
- `id`: The unique ID of the video to be updated. For example: `64c1cdb7f0432ed509593468`

**Headers:**
- `Content-Type`: application/json

**Body:**
```json
{
    "title": "sepatu kece lagi diskon",
    "videoUrl": "https://www.youtube.com/watch?v=qy8PxD3alWw",
    "videoType": "LIVE",
    "creatorId": "64c0cd9161bba9ee29e2f7d8"
}
```
### Example Request
``` bash
curl --location --request PUT 'localhost:3000/api/v1/videos/64c1cdb7f0432ed509593468' \
--data '{
    "title": "sepatu kece lagi diskon",
    "videoUrl": "https://www.youtube.com/watch?v=qy8PxD3alWw",
    "videoType": "LIVE",
    "creatorId": "64c0cd9161bba9ee29e2f7d8"
}'
```

### Example Response
``` json
{
    "code": 200,
    "message": "successfully update video",
    "data": {
        "id": "64c1cdb7f0432ed509593468",
        "title": "sepatu kece lagi diskon",
        "videoUrl": "https://www.youtube.com/watch?v=qy8PxD3alWw",
        "videoType": "LIVE",
        "creatorId": "64c0cd9161bba9ee29e2f7d8"
    }
}

```

### ---Delete Video by ID---

Delete of a specific video based on its unique ID.

### Request

**Method:** DELETE

**Endpoint:** `localhost:3000/api/v1/videos/:id`

**PATH VARIABLES:**
- `id`: The unique ID of the video to be deleted. For example: `64c1cdb7f0432ed509593468`

### Example Request
```bash
curl --location --request DELETE 'localhost:3000/api/v1/videos/64c0d7161bc935d5497a48eb'
```

### Example Response 
```json
{
    "code": 200,
    "message": "successfully delete video",
    "data": []
}
```


### Product API Documentation

This document provides detailed information on the Product API endpoints, which allows you to manage video data in the system.

### ---Create Product by Tokopedia URL---

### Request

**Method:** POST

**Endpoint:** `localhost:3000/api/v1/products`

**Headers:**
- `Content-Type`: application/json

**Body:**
```json
{
    "tokpedUrl": "https://www.tokopedia.com/philips-estore/philips-digital-rice-cooker-hd4515-90-foodcontainer",
    "videoId": "64c1cdb7f0432ed509593468"
}
```
### Example Request
```bash
curl --location 'localhost:3000/api/v1/products' \
--data '{
    "tokpedUrl": "https://www.tokopedia.com/philips-estore/philips-digital-rice-cooker-hd4515-90-foodcontainer",
    "videoId": "64c1cdb7f0432ed509593468"
}'
```

### Example Response
```bash 
{
    "code": 201,
    "message": "successfully create product",
    "data": {
        "id": "64c1cf95f0432ed50959346a",
        "title": "Philips Digital Rice Cooker HD4515/90 - FoodContainer",
        "imageUrl": "https://images.tokopedia.net/img/cache/500-square/VqbcmM/2023/5/26/32fc60de-af0b-4fd6-9572-a530fea7ddb3.jpg.webp?ect=4g",
        "price": 775000,
        "originalPrice": 967000,
        "discount": 20,
        "videoId": "64c1cdb7f0432ed509593468",
        "createdAt": "2023-07-27T01:59:49.740Z"
    }
}
```

### ---Create Product Manually---

### Request

**Method:** POST

**Endpoint:** `localhost:3000/api/v1/products/manual`

**Headers:**
- `Content-Type`: application/json

**Body:**
```json
{
   "title": "guci besar",
   "imageUrl": "https://images.tokopedia.net/img/cache/500-square/VqbcmM/2023/5/26/32fc60de-af0b-4fd6-9572-a530fea7ddb3.jpg.webp?ect=4g",
   "price": 10000,
   "discount": 0,
   "videoId":"64c1cdb7f0432ed509593468"
}
```
### Example Request
```bash
curl --location 'localhost:3000/api/v1/products/manual' \
--data '{
    "title": "guci besar",
    "imageUrl": "https://images.tokopedia.net/img/cache/500-square/VqbcmM/2023/5/26/32fc60de-af0b-4fd6-9572-a530fea7ddb3.jpg.webp?ect=4g",
    "price": 10000,
    "discount": 10,
    "videoId":"64c1cdb7f0432ed509593468"
}'
```

### Example Response
```bash 
{
    "code": 201,
    "message": "successfully create product",
    "data": {
        "id": "64c3256e52ad73522bf8a29c",
        "title": "guci besar",
        "imageUrl": "https://images.tokopedia.net/img/cache/500-square/VqbcmM/2023/5/26/32fc60de-af0b-4fd6-9572-a530fea7ddb3.jpg.webp?ect=4g",
        "price": 9000,
        "originalPrice": 10000,
        "discount": 10,
        "videoId": "64c1cdb7f0432ed509593468",
        "createdAt": "2023-07-28T02:18:22.213Z"
    }
}
```

### Comment API Documentation

This document provides detailed information on the Comment API endpoints, which allows you to manage comments for videos in the system.

### ---Create Comment---

### Request

**Method:** POST

**Endpoint:** `localhost:3000/api/v1/comments`

**Headers:**
- `Content-Type`: application/json

**Body:**
```json
{
    "content": "ada diskon ngga min",
    "videoId": "64c1cdb7f0432ed509593468",
    "userId": "64c0cd9161bba9ee29e2f7d8"
}
```

### Example Request
```bash
curl --location 'localhost:3000/api/v1/comments' \
--data '{
    "content": "ada diskon ngga min",
    "videoId": "64c1cdb7f0432ed509593468",
    "userId": "64c0cd9161bba9ee29e2f7d8"
}'
```

## Example Response 
```json
{
    "code": 201,
    "message": "successfully create comment",
    "data": {
        "id": "64c1d03cf0432ed50959346b",
        "content": "ada diskon ngga min",
        "userId": "64c0cd9161bba9ee29e2f7d8",
        "videoId": "64c1cdb7f0432ed509593468",
        "createdAt": "2023-07-27T02:02:36.964Z"
    }
}

```

### ---Delete Comment by ID---

Delete of a specific comment based on its unique ID.

### Request

**Method:** DELETE

**Endpoint:** `localhost:3000/api/v1/comments/:id`

**PATH VARIABLES:**
- `id`: The unique ID of the comment to be deleted. For example: `64c1cdb7f0432ed509593468`

**Body**
``` json
{
    "content": "Iyaaa kah, yahh min restock lagii dongg",
    "videoId": "64bf3802a2a14c9f61202fe6",
    "userId": "64bf651756849640faf903c4"
}
```

### Example Request
```bash 
curl --location --request DELETE 'localhost:3000/api/v1/comments/64c1d03cf0432ed50959346b' \
--data '{
    "content": "Iyaaa kah, yahh min restock lagii dongg",
    "videoId": "64bf3802a2a14c9f61202fe6",
    "userId": "64bf651756849640faf903c4"
}'
```
### Example Response
```json 
{
    "code": 200,
    "message": "successfully delete comment",
    "data": []
}
```

### ---Get All Comments by Video ID---

Get Comments based on its unique Video ID.

### Request

**Method:** GET

**Endpoint:** `localhost:3000/api/v1/comments/video/:id`

**PATH VARIABLES:**
- `id`: The unique ID of the video. For example: `64c1cdb7f0432ed509593468`

### Example Request 
```bash 
curl --location 'localhost:3000/api/v1/comments/video/64c1cdb7f0432ed509593468'
```

### Example Response 
```json
{
    "code": 200,
    "message": "successfully get all comments by video id",
    "data": [
        {
            "id": "64c1d03cf0432ed50959346b",
            "content": "ada diskon ngga min",
            "username": "ihsan606",
            "videoId": "64c1cdb7f0432ed509593468",
            "userId": "64c0cd9161bba9ee29e2f7d8"
        },
        {
            "id": "64c1d073f0432ed50959346c",
            "content": "boleh beli satuan ngga min ?",
            "username": "ihsan606",
            "videoId": "64c1cdb7f0432ed509593468",
            "userId": "64c0cd9161bba9ee29e2f7d8"
        }
    ]
}
```

## ✍️ Authors

- [@ihsan606](https://github.com/ihsan606) - Muhammad Ihsan Syafiul Umam


