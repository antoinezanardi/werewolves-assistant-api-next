import type { PipeTransform } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { API_RESOURCES } from "../../../../shared/api/enums/api.enum";
import { ValidateMongoId } from "../../../../shared/api/pipes/validate-mongo-id.pipe";
import { ResourceNotFoundException } from "../../../../shared/exception/types/resource-not-found-exception.type";
import { GameRepository } from "../../providers/repositories/game.repository";
import type { Game } from "../../schemas/game.schema";

@Injectable()
export class GetGameByIdPipe implements PipeTransform {
  public constructor(private readonly gameRepository: GameRepository) {}
  public async transform(value: unknown): Promise<Game> {
    const validateMongoIdPipe = new ValidateMongoId();
    const objectId = validateMongoIdPipe.transform(value);
    const game = await this.gameRepository.findOne({ _id: objectId });
    if (game === null) {
      throw new ResourceNotFoundException(API_RESOURCES.GAMES, objectId.toString());
    }
    return game;
  }
}