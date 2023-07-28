export default interface MessageResponse {
  message: string;
}

export interface BaseResponse<T = any> extends MessageResponse {
  code: number;
  data: T;
}
