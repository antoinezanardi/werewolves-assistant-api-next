import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  public getHello(): string {
    void this;
    return "Hello World!";
  }
}