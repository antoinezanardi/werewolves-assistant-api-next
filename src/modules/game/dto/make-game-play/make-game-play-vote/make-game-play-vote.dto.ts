import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsMongoId } from "class-validator";
import { Types } from "mongoose";

class MakeGamePlayVoteDto {
  @ApiProperty({ description: `Vote's source player id.` })
  @Type(() => String)
  @IsMongoId()
  public sourceId: Types.ObjectId;

  @ApiProperty({ description: `Vote's target player id.` })
  @Type(() => String)
  @IsMongoId()
  public targetId: Types.ObjectId;
}

export { MakeGamePlayVoteDto };