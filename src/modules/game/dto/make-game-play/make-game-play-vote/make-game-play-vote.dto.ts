import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId } from "class-validator";

class MakeGamePlayVoteDto {
  @ApiProperty({ description: `Vote's source player id.` })
  @IsMongoId()
  public sourceId: string;

  @ApiProperty({ description: `Vote's target player id.` })
  @IsMongoId()
  public targetId: string;
}

export { MakeGamePlayVoteDto };