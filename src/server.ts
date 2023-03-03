import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap(port = 3000): Promise<void> {
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
}

export { bootstrap };