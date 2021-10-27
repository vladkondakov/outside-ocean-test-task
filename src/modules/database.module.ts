import { ModuleRef } from "@nestjs/core"
import { Logger, Module, OnApplicationShutdown } from "@nestjs/common"
import { Pool } from "pg"
import Config from "config"

import { DatabaseService } from "../services/database.service"

const dbConfig: any = Config.get("db")
const dbPoolName: string = process.env.DB_POOL_NAME || dbConfig.poolName

const databasePoolFactory = async () => {
  return new Pool({
    user: process.env.RDS_USERNAME || dbConfig.username,
    host: process.env.RDS_HOSTNAME || dbConfig.host,
    database: process.env.RDS_DB_NAME || dbConfig.database,
    password: process.env.RDS_PASSWORD || dbConfig.password,
    port: process.env.RDS_PORT || dbConfig.port,
  })
}

@Module({
  providers: [{ provide: dbPoolName, useFactory: databasePoolFactory }, DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule implements OnApplicationShutdown {
  private readonly logger = new Logger(DatabaseModule.name)

  constructor(private readonly moduleRef: ModuleRef) {}

  onApplicationShutdown(signal?: string): any {
    this.logger.log(`Shutting down on signal ${signal}`)
    const pool = this.moduleRef.get(dbPoolName) as Pool
    return pool.end()
  }
}
