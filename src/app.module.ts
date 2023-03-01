import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { getEnvPath, validate } from "./config/env/env.helper";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvPath(),
      isGlobal: true,
      validate,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}