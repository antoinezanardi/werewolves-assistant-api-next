import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

function createSwaggerDocument(path: string, app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle("Werewolves Assistant API Reference 🐺")
    .setDescription("Werewolves Assistant API provides over HTTP requests a way of manage Werewolves games to help the game master.")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(path, app, document);
}

export { createSwaggerDocument };