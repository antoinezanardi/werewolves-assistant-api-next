import { Injectable } from "@nestjs/common";
import type { PipeTransform } from "@nestjs/common";

import { GameRepository } from "@/modules/game/providers/repositories/game.repository";
import type { Game } from "@/modules/game/schemas/game.schema";

import { ApiResources } from "@/shared/api/enums/api.enums";
import { ValidateMongoId } from "@/shared/api/pipes/validate-mongo-id.pipe";
import { ResourceNotFoundException } from "@/shared/exception/types/resource-not-found-exception.types";

@Injectable()
export class GetGameByIdPipe implements PipeTransform {
  public constructor(private readonly gameRepository: GameRepository) {}

  public async transform(value: unknown): Promise<Game> {
    const validateMongoIdPipe = new ValidateMongoId();
    const objectId = validateMongoIdPipe.transform(value);
    const game = await this.gameRepository.findOne({ _id: objectId });
    if (game === null) {
      throw new ResourceNotFoundException(ApiResources.GAMES, objectId.toString());
    }
    return game;
  }
}