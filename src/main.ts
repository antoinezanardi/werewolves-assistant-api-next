import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const port = 3000;
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
}

void bootstrap();