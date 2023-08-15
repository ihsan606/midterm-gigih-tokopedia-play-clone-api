import jwt from 'jsonwebtoken';
require('dotenv').config();

export const createToken = (
  username: string,
  email: string,
  role: string,
  id: string,
) => {
  const secret = process.env.JWT_SECRET ?? '';
  const token = jwt.sign(
    {
      name: username,
      email: email,
      role: role,
      id: id,
    },
    secret,
    {
      expiresIn: '7d',
    },
  );

  return token;
};
