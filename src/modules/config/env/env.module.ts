import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { getEnvPaths, validate } from "@/modules/config/env/helpers/env.helper";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvPaths(),
      isGlobal: true,
      validate,
    }),
  ],
})
export class EnvModule {}