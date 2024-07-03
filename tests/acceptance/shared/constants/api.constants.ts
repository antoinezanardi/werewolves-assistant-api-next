import { HttpStatus } from "@nestjs/common";

const SUCCESS_HTTP_STATUSES: readonly HttpStatus[] = [
  HttpStatus.CREATED,
  HttpStatus.OK,
];

export { SUCCESS_HTTP_STATUSES };