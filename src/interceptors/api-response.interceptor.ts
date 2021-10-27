// eslint-disable-next-line prettier/prettier
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus } from "@nestjs/common"
import { Observable } from "rxjs"
import { map } from "rxjs/operators"

import { IApiResponse } from "../interfaces/api-response.interface"

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp()
    const response = http.getResponse()

    return next.handle().pipe(
      map((responseData: T) => {
        const apiResponse: IApiResponse<T> = {
          data: responseData,
          statusCode: HttpStatus.OK,
          error: "",
        }
        return apiResponse
      })
    )
  }
}
