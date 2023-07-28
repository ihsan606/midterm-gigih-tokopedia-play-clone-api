import { AnyZodObject } from 'zod';

export interface RequestValidator {
  params? : AnyZodObject,
  body?: AnyZodObject,
  query?: AnyZodObject
}