import { AlreadyExistError } from '../../errors/ExistError';
import { NotFoundError } from '../../errors/NotFoundError';
import prisma from '../../prisma';
import { UserRequest } from './user.model';

export const checkUserExist = async (email: string, username: string) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: username },
        { email: email },
      ],
    },
  });
        
  if (user) {
    throw new AlreadyExistError('User already exists, use other email and username');
  }
  return false;
};

export const findOne = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id: id },
    select: {
      id: true,
      email: true,
      username: true,
      profile: {
        select: {
          fullName: true,
          profilePicUrl: true,
          dateOfBirth: true,
        },
      },
    },
  });
  
  if (!user) {
    throw new NotFoundError(`User with id ${id} not found`);
  }
  
  return user;
};



export const createOne = async (user: UserRequest) => {
  await checkUserExist(user.email, user.password);
  return prisma.user.create({
    data: {
      email: user.email,
      username: user.username,
      password: user.password,
      profile: {
        create: {
          fullName: user.fullName,
          dateOfBirth: user.dateOfBirth,
          profilePicUrl: `https://ui-avatars.com/api/?background=random&name=${user.username}&color=#fff`,
        },
      },
    },
  });
  
};


  