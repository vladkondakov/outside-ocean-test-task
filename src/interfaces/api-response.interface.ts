export interface IApiResponse<T> {
  data: T
  statusCode: number
  error: string
}
