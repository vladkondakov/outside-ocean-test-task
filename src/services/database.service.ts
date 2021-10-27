import { Inject, Injectable, Logger } from "@nestjs/common"
import { Pool, QueryResult } from "pg"
import Config from "config"

import { DbQResultDto } from "../dto/db/db-qresult.dto"
import { DbQResultArrayDto } from "../dto/db/db-qresult-array.dto"

const dbConfig: any = Config.get("db")

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name)

  constructor(@Inject(dbConfig.poolName) private readonly _pool: Pool) {}

  async getQueryResult<T>(queryText: string): Promise<DbQResultDto<T>> {
    this.logger.debug(`Executing query: ${queryText}`)
    const qResult: QueryResult<T> = await this._pool.query(queryText)
    this.logger.debug(`Executed query, result size ${qResult.rows.length}`)
    const result = this.formResult<T>(qResult)
    return result
  }

  async getQueryArrayResult<T>(queryText: string): Promise<DbQResultArrayDto<T>> {
    this.logger.debug(`Executing query: ${queryText}`)
    const qResult: QueryResult<T> = await this._pool.query(queryText)
    this.logger.debug(`Executed query, result size ${qResult.rows.length}`)
    const result = this.formArrayResult<T>(qResult)
    return result
  }

  private formResult<T>(qResult: QueryResult<T>): DbQResultDto<T> {
    const result: DbQResultDto<T> = {
      row: qResult.rows[0],
      rowsCount: qResult.rowCount,
    }
    return result
  }

  private formArrayResult<T>(qResult: QueryResult<T>): DbQResultArrayDto<T> {
    const result: DbQResultArrayDto<T> = {
      rows: qResult.rows,
      rowsCount: qResult.rowCount,
    }
    return result
  }
}
