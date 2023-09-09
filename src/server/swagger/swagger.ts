import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import type { INestApplication } from "@nestjs/common";
import type { SwaggerCustomOptions } from "@nestjs/swagger";

function createSwaggerDocument(path: string, app: INestApplication): void {
  const title = "Werewolves Assistant API Reference 🐺";
  const version = process.env.npm_package_version ?? "?";
  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription("Werewolves Assistant API provides over HTTP requests a way of manage Werewolves games to help the game master.")
    .setVersion(version)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const options: SwaggerCustomOptions = {
    customSiteTitle: title,
    customfavIcon: "public/assets/images/logo/square/werewolves-logo-small.png",
    customCssUrl: "public/assets/css/custom-swagger.css",
  };
  SwaggerModule.setup(path, app, document, options);
}

export { createSwaggerDocument };