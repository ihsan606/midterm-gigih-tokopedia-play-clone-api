import { Role } from '@prisma/client';
import { ClientError } from '../../errors/ClientError';
import { AlreadyExistError } from '../../errors/ExistError';
import { NotFoundError } from '../../errors/NotFoundError';
import prisma from '../../prisma';
import { createToken } from '../../utils/create-token.util';
import { LoginRequest, UserRequest } from './user.model';
import bcrypt from 'bcrypt';

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
  await checkUserExist(user.email, user.username);
  const hashedPassword = await bcrypt.hash(user.password, 8);
  const newUser = await prisma.user.create({
    data: {
      email: user.email,
      username: user.username,
      password: hashedPassword,
      role: user.role === Role.USER ? Role.USER : Role.SELLER,
      profile: {
        create: {
          fullName: user.fullName,
          dateOfBirth: user.dateOfBirth,
          profilePicUrl: `https://ui-avatars.com/api/?background=random&name=${user.username}&color=#fff`,
        },
      },
    },
  });

  newUser.password = '';

  const token = await createToken(newUser.username, newUser.email, newUser.role, newUser.id);


  return {
    user: newUser,
    token,
  };
  
};

export const login = async (user: LoginRequest) => {
  const currentUser = await prisma.user.findFirst({
    where: { username: user.username },
  });

  if (!currentUser) {
    throw new NotFoundError(`User with username ${user.username} not found`);
  }

  const isValidPassword = await bcrypt.compare(user.password, currentUser.password);
  if ( !isValidPassword ) {
    throw new ClientError('Password is not valid');
  }

  const token = await createToken(currentUser.username, currentUser.email, currentUser.role, currentUser.id);
  currentUser.password = '';

  return {
    user: currentUser,
    token,
  };
};



  