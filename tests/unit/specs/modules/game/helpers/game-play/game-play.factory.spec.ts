import { plainToInstance } from "class-transformer";

import { createGamePlay, createGamePlayBigBadWolfEats, createGamePlayCharmedMeetEachOther, createGamePlayCupidCharms, createGamePlayDefenderProtects, createGamePlayFoxSniffs, createGamePlayHunterShoots, createGamePlayLoversMeetEachOther, createGamePlayPiedPiperCharms, createGamePlayScandalmongerMarks, createGamePlayScapegoatBansVoting, createGamePlaySeerLooks, createGamePlaySheriffDelegates, createGamePlaySheriffSettlesVotes, createGamePlaySource, createGamePlayStutteringJudgeRequestsAnotherVote, createGamePlaySurvivorsBuryDeadBodies, createGamePlaySurvivorsElectSheriff, createGamePlaySurvivorsVote, createGamePlayThiefChoosesCard, createGamePlayThreeBrothersMeetEachOther, createGamePlayTwoSistersMeetEachOther, createGamePlayWerewolvesEat, createGamePlayWhiteWerewolfEats, createGamePlayWildChildChoosesModel, createGamePlayWitchUsesPotions, createGamePlayWolfHoundChoosesSide } from "@/modules/game/helpers/game-play/game-play.factory";
import { GamePlaySource } from "@/modules/game/schemas/game-play/game-play-source/game-play-source.schema";
import { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import type { GamePlayAction, GamePlayCause, GamePlayOccurrence, GamePlayType } from "@/modules/game/types/game-play/game-play.types";

import { createFakeGamePlaySource } from "@tests/factories/game/schemas/game-play/game-play-source/game-play-source.schema.factory";
import { createFakeGamePlay } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";

describe("Game Play Factory", () => {
  describe("createGamePlayStutteringJudgeRequestsAnotherVote", () => {
    it("should create game play stuttering judge requests another vote when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        type: "request-another-vote",
        source: createFakeGamePlaySource({ name: "stuttering-judge" }),
        action: "request-another-vote",
        occurrence: "consequential",
      });

      expect(createGamePlayStutteringJudgeRequestsAnotherVote()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlaySurvivorsBuryDeadBodies", () => {
    it("should create game play survivors bury dead bodies when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        type: "bury-dead-bodies",
        source: createFakeGamePlaySource({ name: "survivors" }),
        action: "bury-dead-bodies",
        occurrence: "consequential",
      });

      expect(createGamePlaySurvivorsBuryDeadBodies()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlaySheriffSettlesVotes", () => {
    it("should create game play sheriff settles votes when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        type: "target",
        source: createFakeGamePlaySource({ name: "sheriff" }),
        action: "settle-votes",
        occurrence: "consequential",
      });

      expect(createGamePlaySheriffSettlesVotes()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlaySheriffDelegates", () => {
    it("should create game play sheriff delegates when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        type: "target",
        source: createFakeGamePlaySource({ name: "sheriff" }),
        action: "delegate",
        occurrence: "consequential",
      });

      expect(createGamePlaySheriffDelegates()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlaySurvivorsVote", () => {
    it.each<{
      test: string;
      expectedGamePlay: GamePlay;
      causes: GamePlayCause[] | undefined;
    }>([
      {
        test: "should create game play survivors vote when called with cause of angel presence.",
        expectedGamePlay: createFakeGamePlay({
          type: "vote",
          source: createFakeGamePlaySource({ name: "survivors" }),
          action: "vote",
          causes: ["angel-presence"],
          occurrence: "one-night-only",
        }),
        causes: ["angel-presence"],
      },
      {
        test: "should create game play survivors vote when called with cause of previous votes were in ties.",
        expectedGamePlay: createFakeGamePlay({
          type: "vote",
          source: createFakeGamePlaySource({ name: "survivors" }),
          action: "vote",
          causes: ["previous-votes-were-in-ties"],
          occurrence: "consequential",
        }),
        causes: ["previous-votes-were-in-ties"],
      },
      {
        test: "should create game play survivors vote when called with cause of stuttering judge request.",
        expectedGamePlay: createFakeGamePlay({
          type: "vote",
          source: createFakeGamePlaySource({ name: "survivors" }),
          action: "vote",
          causes: ["stuttering-judge-request"],
          occurrence: "consequential",
        }),
        causes: ["stuttering-judge-request"],
      },
      {
        test: "should create game play survivors vote when called with undefined cause.",
        expectedGamePlay: createFakeGamePlay({
          type: "vote",
          source: createFakeGamePlaySource({ name: "survivors" }),
          action: "vote",
          occurrence: "on-days",
        }),
        causes: undefined,
      },
    ])("$test", ({ expectedGamePlay, causes }) => {
      expect(createGamePlaySurvivorsVote({ causes })).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlaySurvivorsElectSheriff", () => {
    it("should create game play all elect sheriff when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        type: "vote",
        source: createFakeGamePlaySource({ name: "survivors" }),
        action: "elect-sheriff",
        occurrence: "anytime",
      });

      expect(createGamePlaySurvivorsElectSheriff()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayThiefChoosesCard", () => {
    it("should create game play thief chooses card when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        type: "choose-card",
        source: createFakeGamePlaySource({ name: "thief" }),
        action: "choose-card",
        occurrence: "one-night-only",
      });

      expect(createGamePlayThiefChoosesCard()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayScapegoatBansVoting", () => {
    it("should create game play scapegoat bans voting when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        type: "target",
        source: createFakeGamePlaySource({ name: "scapegoat" }),
        action: "ban-voting",
        occurrence: "consequential",
      });

      expect(createGamePlayScapegoatBansVoting()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayWolfHoundChoosesSide", () => {
    it("should create game play wolf-hound chooses side when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        type: "choose-side",
        source: createFakeGamePlaySource({ name: "wolf-hound" }),
        action: "choose-side",
        occurrence: "one-night-only",
      });

      expect(createGamePlayWolfHoundChoosesSide()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayWildChildChoosesModel", () => {
    it("should create game play wild child chooses model when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        type: "target",
        source: createFakeGamePlaySource({ name: "wild-child" }),
        action: "choose-model",
        occurrence: "one-night-only",
      });

      expect(createGamePlayWildChildChoosesModel()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayFoxSniffs", () => {
    it("should create game play fox sniffs when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        type: "target",
        source: createFakeGamePlaySource({ name: "fox" }),
        action: "sniff",
        occurrence: "on-nights",
      });

      expect(createGamePlayFoxSniffs()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayCharmedMeetEachOther", () => {
    it("should create game play charmed players meet each other when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        type: "no-action",
        source: createFakeGamePlaySource({ name: "charmed" }),
        action: "meet-each-other",
        occurrence: "on-nights",
      });

      expect(createGamePlayCharmedMeetEachOther()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayLoversMeetEachOther", () => {
    it("should create game play lovers meet each other when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        type: "no-action",
        source: createFakeGamePlaySource({ name: "lovers" }),
        action: "meet-each-other",
        occurrence: "one-night-only",
      });

      expect(createGamePlayLoversMeetEachOther()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayThreeBrothersMeetEachOther", () => {
    it("should create game play three brothers meet each other when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        type: "no-action",
        source: createFakeGamePlaySource({ name: "three-brothers" }),
        action: "meet-each-other",
        occurrence: "on-nights",
      });

      expect(createGamePlayThreeBrothersMeetEachOther()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayTwoSistersMeetEachOther", () => {
    it("should create game play two sisters meet each other when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        type: "no-action",
        source: createFakeGamePlaySource({ name: "two-sisters" }),
        action: "meet-each-other",
        occurrence: "on-nights",
      });

      expect(createGamePlayTwoSistersMeetEachOther()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayScandalmongerMarks", () => {
    it("should create game play scandalmonger marks when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        type: "target",
        source: createFakeGamePlaySource({ name: "scandalmonger" }),
        action: "mark",
        occurrence: "on-nights",
      });

      expect(createGamePlayScandalmongerMarks()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayDefenderProtects", () => {
    it("should create game play defender protects when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        type: "target",
        source: createFakeGamePlaySource({ name: "defender" }),
        action: "protect",
        occurrence: "on-nights",
      });

      expect(createGamePlayDefenderProtects()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayHunterShoots", () => {
    it("should create game play hunter shoots when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        type: "target",
        source: createFakeGamePlaySource({ name: "hunter" }),
        action: "shoot",
        occurrence: "consequential",
      });

      expect(createGamePlayHunterShoots()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayWitchUsesPotions", () => {
    it("should create game play witch uses potions when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        type: "target",
        source: createFakeGamePlaySource({ name: "witch" }),
        action: "use-potions",
        occurrence: "on-nights",
      });

      expect(createGamePlayWitchUsesPotions()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayPiedPiperCharms", () => {
    it("should create game play pied piper charms when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        type: "target",
        source: createFakeGamePlaySource({ name: "pied-piper" }),
        action: "charm",
        occurrence: "on-nights",
      });

      expect(createGamePlayPiedPiperCharms()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayCupidCharms", () => {
    it("should create game play cupid charms when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        type: "target",
        source: createFakeGamePlaySource({ name: "cupid" }),
        action: "charm",
        occurrence: "one-night-only",
      });

      expect(createGamePlayCupidCharms()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlaySeerLooks", () => {
    it("should create game play seer looks when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        type: "target",
        source: createFakeGamePlaySource({ name: "seer" }),
        action: "look",
        occurrence: "on-nights",
      });

      expect(createGamePlaySeerLooks()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayWhiteWerewolfEats", () => {
    it("should create game play white werewolf eats when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        type: "target",
        source: createFakeGamePlaySource({ name: "white-werewolf" }),
        action: "eat",
        occurrence: "on-nights",
      });

      expect(createGamePlayWhiteWerewolfEats()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayBigBadWolfEats", () => {
    it("should create game play big bad wolf eats when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        type: "target",
        source: createFakeGamePlaySource({ name: "big-bad-wolf" }),
        action: "eat",
        occurrence: "on-nights",
      });

      expect(createGamePlayBigBadWolfEats()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayWerewolvesEat", () => {
    it("should create game play werewolves eat when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        type: "target",
        source: createFakeGamePlaySource({ name: "werewolves" }),
        action: "eat",
        occurrence: "on-nights",
      });

      expect(createGamePlayWerewolvesEat()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlaySource", () => {
    it("should create game play source when called.", () => {
      const gamePlaySource = {
        type: "target",
        name: "seer",
        players: [createFakePlayer()],
        tata: "toto",
      };

      expect(createGamePlaySource(gamePlaySource as GamePlaySource)).toStrictEqual<GamePlaySource>(plainToInstance(GamePlaySource, {
        name: "seer",
        players: gamePlaySource.players,
      }));
    });
  });

  describe("createGamePlay", () => {
    it("should create game play when called.", () => {
      const gamePlay = {
        type: "target" as GamePlayType,
        source: createFakeGamePlaySource({ name: "wild-child" }),
        action: "choose-model" as GamePlayAction,
        occurrence: "anytime" as GamePlayOccurrence,
        tata: "toto",
      };

      expect(createGamePlay(gamePlay)).toStrictEqual<GamePlay>(plainToInstance(GamePlay, {
        type: "target",
        source: createGamePlaySource({ name: "wild-child" }),
        action: "choose-model",
        occurrence: "anytime",
      }));
    });
  });
});