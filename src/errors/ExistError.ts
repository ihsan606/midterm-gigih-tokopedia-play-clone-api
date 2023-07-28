export class AlreadyExistError extends Error {
  statusCode: number;
    
  constructor(message: string) {
    super(message);
    this.name = 'AlreadyExistError';
    this.statusCode = 403;
  }
}