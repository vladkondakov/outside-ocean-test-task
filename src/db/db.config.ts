import Config from "config"

const dbConfig: any = Config.get("db")

const config = {
  type: dbConfig.type,
  host: process.env.DB_HOSTNAME || dbConfig.host,
  port: process.env.DB_PORT || dbConfig.port,
  username: process.env.DB_USERNAME || dbConfig.username,
  password: process.env.DB_PASSWORD || dbConfig.password,
  database: process.env.DB_NAME || dbConfig.database,
  entities: ["src/**/*.entity.ts", "src/**/**/*.entity.ts"],
  synchronize: process.env.DB_SYNC || dbConfig.synchronize,
}

export default config
