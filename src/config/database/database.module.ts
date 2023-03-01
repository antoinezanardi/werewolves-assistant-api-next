import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { mongooseModuleFactory } from "./database.helper";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: mongooseModuleFactory,
    }),
  ],
})

class DatabaseModule {}

export { DatabaseModule };