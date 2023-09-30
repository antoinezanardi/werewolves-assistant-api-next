import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, Min } from "class-validator";

import { ApiSortOrder } from "@/shared/api/enums/api.enum";

class GetGameHistoryDto {
  @ApiProperty({
    description: "Number of returned game's history records. `0` means no limit",
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @Min(0)
  public limit: number = 0;

  @ApiProperty({
    description: "Sorting order of returned game's history records by creation date. `asc` means from oldest to newest, `desc` means from newest to oldest",
    required: false,
  })
  @IsOptional()
  @IsEnum(ApiSortOrder)
  public order: ApiSortOrder = ApiSortOrder.ASC;
}

export { GetGameHistoryDto };