import { HttpStatus } from "@nestjs/common";

const SUCCESS_HTTP_STATUSES: Readonly<HttpStatus[]> = [
  HttpStatus.CREATED,
  HttpStatus.OK,
];

export { SUCCESS_HTTP_STATUSES };