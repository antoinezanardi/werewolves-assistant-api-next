import { plainToInstance } from "class-transformer";

import { GamePlayActions, GamePlayCauses, GamePlayOccurrences } from "@/modules/game/enums/game-play.enum";
import { PlayerAttributeNames, PlayerGroups } from "@/modules/game/enums/player.enum";
import { createGamePlay, createGamePlayBigBadWolfEats, createGamePlayCharmedMeetEachOther, createGamePlayCupidCharms, createGamePlayWolfHoundChoosesSide, createGamePlayFoxSniffs, createGamePlayDefenderProtects, createGamePlayHunterShoots, createGamePlayLoversMeetEachOther, createGamePlayPiedPiperCharms, createGamePlayScandalmongerMarks, createGamePlayScapegoatBansVoting, createGamePlaySeerLooks, createGamePlaySheriffDelegates, createGamePlaySheriffSettlesVotes, createGamePlaySource, createGamePlaySurvivorsBuryDeadBodies, createGamePlaySurvivorsElectSheriff, createGamePlaySurvivorsVote, createGamePlayThiefChoosesCard, createGamePlayThreeBrothersMeetEachOther, createGamePlayTwoSistersMeetEachOther, createGamePlayWerewolvesEat, createGamePlayWhiteWerewolfEats, createGamePlayWildChildChoosesModel, createGamePlayWitchUsesPotions, createGamePlayStutteringJudgeRequestsAnotherVote } from "@/modules/game/helpers/game-play/game-play.factory";
import { GamePlaySource } from "@/modules/game/schemas/game-play/game-play-source/game-play-source.schema";
import { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { createFakeGamePlaySource } from "@tests/factories/game/schemas/game-play/game-play-source.schema.factory";
import { createFakeGamePlay } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";

describe("Game Play Factory", () => {
  describe("createGamePlayStutteringJudgeRequestsAnotherVote", () => {
    it("should create game play stuttering judge requests another vote when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: RoleNames.STUTTERING_JUDGE }),
        action: GamePlayActions.REQUEST_ANOTHER_VOTE,
        occurrence: GamePlayOccurrences.CONSEQUENTIAL,
      });

      expect(createGamePlayStutteringJudgeRequestsAnotherVote()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlaySurvivorsBuryDeadBodies", () => {
    it("should create game play survivors bury dead bodies when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: PlayerGroups.SURVIVORS }),
        action: GamePlayActions.BURY_DEAD_BODIES,
        occurrence: GamePlayOccurrences.CONSEQUENTIAL,
      });

      expect(createGamePlaySurvivorsBuryDeadBodies()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlaySheriffSettlesVotes", () => {
    it("should create game play sheriff settles votes when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: PlayerAttributeNames.SHERIFF }),
        action: GamePlayActions.SETTLE_VOTES,
        occurrence: GamePlayOccurrences.CONSEQUENTIAL,
      });

      expect(createGamePlaySheriffSettlesVotes()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlaySheriffDelegates", () => {
    it("should create game play sheriff delegates when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: PlayerAttributeNames.SHERIFF }),
        action: GamePlayActions.DELEGATE,
        occurrence: GamePlayOccurrences.CONSEQUENTIAL,
      });

      expect(createGamePlaySheriffDelegates()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlaySurvivorsVote", () => {
    it.each<{
      test: string;
      expectedGamePlay: GamePlay;
      cause: GamePlayCauses | undefined;
    }>([
      {
        test: "should create game play survivors vote when called with cause of angel presence.",
        expectedGamePlay: createFakeGamePlay({
          source: createFakeGamePlaySource({ name: PlayerGroups.SURVIVORS }),
          action: GamePlayActions.VOTE,
          cause: GamePlayCauses.ANGEL_PRESENCE,
          occurrence: GamePlayOccurrences.ONE_NIGHT_ONLY,
        }),
        cause: GamePlayCauses.ANGEL_PRESENCE,
      },
      {
        test: "should create game play survivors vote when called with cause of previous votes were in ties.",
        expectedGamePlay: createFakeGamePlay({
          source: createFakeGamePlaySource({ name: PlayerGroups.SURVIVORS }),
          action: GamePlayActions.VOTE,
          cause: GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES,
          occurrence: GamePlayOccurrences.CONSEQUENTIAL,
        }),
        cause: GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES,
      },
      {
        test: "should create game play survivors vote when called with cause of stuttering judge request.",
        expectedGamePlay: createFakeGamePlay({
          source: createFakeGamePlaySource({ name: PlayerGroups.SURVIVORS }),
          action: GamePlayActions.VOTE,
          cause: GamePlayCauses.STUTTERING_JUDGE_REQUEST,
          occurrence: GamePlayOccurrences.CONSEQUENTIAL,
        }),
        cause: GamePlayCauses.STUTTERING_JUDGE_REQUEST,
      },
      {
        test: "should create game play survivors vote when called with undefined cause.",
        expectedGamePlay: createFakeGamePlay({
          source: createFakeGamePlaySource({ name: PlayerGroups.SURVIVORS }),
          action: GamePlayActions.VOTE,
          occurrence: GamePlayOccurrences.ON_DAYS,
        }),
        cause: undefined,
      },
    ])("$test", ({ expectedGamePlay, cause }) => {
      expect(createGamePlaySurvivorsVote({ cause })).toStrictEqual<GamePlay>(expectedGamePlay);
    });

    it("should create default game play survivors vote when called with overridden cause.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: PlayerGroups.SURVIVORS }),
        action: GamePlayActions.VOTE,
        occurrence: GamePlayOccurrences.ON_DAYS,
      });

      expect(createGamePlaySurvivorsVote()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlaySurvivorsElectSheriff", () => {
    it("should create game play all elect sheriff when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: PlayerGroups.SURVIVORS }),
        action: GamePlayActions.ELECT_SHERIFF,
        occurrence: GamePlayOccurrences.ANYTIME,
      });

      expect(createGamePlaySurvivorsElectSheriff()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayThiefChoosesCard", () => {
    it("should create game play thief chooses card when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: RoleNames.THIEF }),
        action: GamePlayActions.CHOOSE_CARD,
        occurrence: GamePlayOccurrences.ONE_NIGHT_ONLY,
      });

      expect(createGamePlayThiefChoosesCard()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayScapegoatBansVoting", () => {
    it("should create game play scapegoat bans voting when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: RoleNames.SCAPEGOAT }),
        action: GamePlayActions.BAN_VOTING,
        occurrence: GamePlayOccurrences.CONSEQUENTIAL,
      });

      expect(createGamePlayScapegoatBansVoting()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayWolfHoundChoosesSide", () => {
    it("should create game play wolf-hound chooses side when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: RoleNames.WOLF_HOUND }),
        action: GamePlayActions.CHOOSE_SIDE,
        occurrence: GamePlayOccurrences.ONE_NIGHT_ONLY,
      });

      expect(createGamePlayWolfHoundChoosesSide()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayWildChildChoosesModel", () => {
    it("should create game play wild child chooses model when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: RoleNames.WILD_CHILD }),
        action: GamePlayActions.CHOOSE_MODEL,
        occurrence: GamePlayOccurrences.ONE_NIGHT_ONLY,
      });

      expect(createGamePlayWildChildChoosesModel()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayFoxSniffs", () => {
    it("should create game play fox sniffs when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: RoleNames.FOX }),
        action: GamePlayActions.SNIFF,
        occurrence: GamePlayOccurrences.ON_NIGHTS,
      });

      expect(createGamePlayFoxSniffs()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayCharmedMeetEachOther", () => {
    it("should create game play charmed players meet each other when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: PlayerGroups.CHARMED }),
        action: GamePlayActions.MEET_EACH_OTHER,
        occurrence: GamePlayOccurrences.ON_NIGHTS,
      });

      expect(createGamePlayCharmedMeetEachOther()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayLoversMeetEachOther", () => {
    it("should create game play lovers meet each other when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: PlayerGroups.LOVERS }),
        action: GamePlayActions.MEET_EACH_OTHER,
        occurrence: GamePlayOccurrences.ONE_NIGHT_ONLY,
      });

      expect(createGamePlayLoversMeetEachOther()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayThreeBrothersMeetEachOther", () => {
    it("should create game play three brothers meet each other when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: RoleNames.THREE_BROTHERS }),
        action: GamePlayActions.MEET_EACH_OTHER,
        occurrence: GamePlayOccurrences.ON_NIGHTS,
      });

      expect(createGamePlayThreeBrothersMeetEachOther()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayTwoSistersMeetEachOther", () => {
    it("should create game play two sisters meet each other when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: RoleNames.TWO_SISTERS }),
        action: GamePlayActions.MEET_EACH_OTHER,
        occurrence: GamePlayOccurrences.ON_NIGHTS,
      });

      expect(createGamePlayTwoSistersMeetEachOther()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayScandalmongerMarks", () => {
    it("should create game play scandalmonger marks when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: RoleNames.SCANDALMONGER }),
        action: GamePlayActions.MARK,
        occurrence: GamePlayOccurrences.ON_NIGHTS,
      });

      expect(createGamePlayScandalmongerMarks()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayDefenderProtects", () => {
    it("should create game play defender protects when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: RoleNames.DEFENDER }),
        action: GamePlayActions.PROTECT,
        occurrence: GamePlayOccurrences.ON_NIGHTS,
      });

      expect(createGamePlayDefenderProtects()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayHunterShoots", () => {
    it("should create game play hunter shoots when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: RoleNames.HUNTER }),
        action: GamePlayActions.SHOOT,
        occurrence: GamePlayOccurrences.CONSEQUENTIAL,
      });

      expect(createGamePlayHunterShoots()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayWitchUsesPotions", () => {
    it("should create game play witch uses potions when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: RoleNames.WITCH }),
        action: GamePlayActions.USE_POTIONS,
        occurrence: GamePlayOccurrences.ON_NIGHTS,
      });

      expect(createGamePlayWitchUsesPotions()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayPiedPiperCharms", () => {
    it("should create game play pied piper charms when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: RoleNames.PIED_PIPER }),
        action: GamePlayActions.CHARM,
        occurrence: GamePlayOccurrences.ON_NIGHTS,
      });

      expect(createGamePlayPiedPiperCharms()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayCupidCharms", () => {
    it("should create game play cupid charms when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: RoleNames.CUPID }),
        action: GamePlayActions.CHARM,
        occurrence: GamePlayOccurrences.ONE_NIGHT_ONLY,
      });

      expect(createGamePlayCupidCharms()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlaySeerLooks", () => {
    it("should create game play seer looks when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: RoleNames.SEER }),
        action: GamePlayActions.LOOK,
        occurrence: GamePlayOccurrences.ON_NIGHTS,
      });

      expect(createGamePlaySeerLooks()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayWhiteWerewolfEats", () => {
    it("should create game play white werewolf eats when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: RoleNames.WHITE_WEREWOLF }),
        action: GamePlayActions.EAT,
        occurrence: GamePlayOccurrences.ON_NIGHTS,
      });

      expect(createGamePlayWhiteWerewolfEats()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayBigBadWolfEats", () => {
    it("should create game play big bad wolf eats when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: RoleNames.BIG_BAD_WOLF }),
        action: GamePlayActions.EAT,
        occurrence: GamePlayOccurrences.ON_NIGHTS,
      });

      expect(createGamePlayBigBadWolfEats()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayWerewolvesEat", () => {
    it("should create game play werewolves eat when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: PlayerGroups.WEREWOLVES }),
        action: GamePlayActions.EAT,
        occurrence: GamePlayOccurrences.ON_NIGHTS,
      });

      expect(createGamePlayWerewolvesEat()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlaySource", () => {
    it("should create game play source when called.", () => {
      const gamePlaySource = {
        name: RoleNames.SEER,
        players: [createFakePlayer()],
        tata: "toto",
      };

      expect(createGamePlaySource(gamePlaySource as GamePlaySource)).toStrictEqual<GamePlaySource>(plainToInstance(GamePlaySource, {
        name: RoleNames.SEER,
        players: gamePlaySource.players,
      }));
    });
  });

  describe("createGamePlay", () => {
    it("should create game play when called.", () => {
      const gamePlay = {
        source: createFakeGamePlaySource({ name: RoleNames.WILD_CHILD }),
        action: GamePlayActions.CHOOSE_MODEL,
        occurrence: GamePlayOccurrences.ANYTIME,
        tata: "toto",
      };

      expect(createGamePlay(gamePlay)).toStrictEqual<GamePlay>(plainToInstance(GamePlay, {
        source: createGamePlaySource({ name: RoleNames.WILD_CHILD }),
        action: GamePlayActions.CHOOSE_MODEL,
        occurrence: GamePlayOccurrences.ANYTIME,
      }));
    });
  });
});