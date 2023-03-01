import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./config/database/database.module";
import { getEnvPaths, validate } from "./config/env/env.helper";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvPaths(),
      isGlobal: true,
      validate,
    }),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
class AppModule {}

export { AppModule };