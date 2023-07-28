import { ZodIssue } from 'zod';
import MessageResponse from './MessageResponse';

export default interface ErrorResponse extends MessageResponse {
  stack?: string;
}

export interface ZodErrorResponse extends MessageResponse {
  error?: ZodIssue[]
}

export interface BaseErrorResponse extends MessageResponse {
  code?: number;
  data: null;
}