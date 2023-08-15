import { Response } from 'express';

export const setCookie = (res: Response, name: string, value: any)=> {
  res.cookie(name, value, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    domain: 'localhost',
  });
};

export const removeCookie = (res: Response, name: string)=> {
  res.cookie(name, '', {
    httpOnly: true,
    expires: new Date(0),
  });
};
