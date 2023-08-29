import { plainToInstance } from "class-transformer";

import { GamePlayActions } from "@/modules/game/enums/game-play.enum";
import { PlayerAttributeNames, PlayerGroups } from "@/modules/game/enums/player.enum";
import { createGamePlay, createGamePlayAllElectSheriff, createGamePlayAllVote, createGamePlayBigBadWolfEats, createGamePlayCharmedMeetEachOther, createGamePlayCupidCharms, createGamePlayDogWolfChoosesSide, createGamePlayFoxSniffs, createGamePlayGuardProtects, createGamePlayHunterShoots, createGamePlayLoversMeetEachOther, createGamePlayPiedPiperCharms, createGamePlayRavenMarks, createGamePlayScapegoatBansVoting, createGamePlaySeerLooks, createGamePlaySheriffDelegates, createGamePlaySheriffSettlesVotes, createGamePlaySource, createGamePlayStutteringJudgeChoosesSign, createGamePlayThiefChoosesCard, createGamePlayThreeBrothersMeetEachOther, createGamePlayTwoSistersMeetEachOther, createGamePlayWerewolvesEat, createGamePlayWhiteWerewolfEats, createGamePlayWildChildChoosesModel, createGamePlayWitchUsesPotions } from "@/modules/game/helpers/game-play/game-play.factory";
import { GamePlaySource } from "@/modules/game/schemas/game-play/game-play-source/game-play-source.schema";
import { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";
import { createFakeGamePlay } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGamePlaySource } from "@tests/factories/game/schemas/game-play/game-play-source.schema.factory";

describe("Game Play Factory", () => {
  describe("createGamePlaySheriffSettlesVotes", () => {
    it("should create game play sheriff settles votes when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: PlayerAttributeNames.SHERIFF }),
        action: GamePlayActions.SETTLE_VOTES,
      });

      expect(createGamePlaySheriffSettlesVotes()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlaySheriffDelegates", () => {
    it("should create game play sheriff delegates when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: PlayerAttributeNames.SHERIFF }),
        action: GamePlayActions.DELEGATE,
      });

      expect(createGamePlaySheriffDelegates()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayAllVote", () => {
    it("should create game play all vote when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: PlayerGroups.ALL }),
        action: GamePlayActions.VOTE,
      });

      expect(createGamePlayAllVote()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayAllElectSheriff", () => {
    it("should create game play all elect sheriff when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: PlayerGroups.ALL }),
        action: GamePlayActions.ELECT_SHERIFF,
      });

      expect(createGamePlayAllElectSheriff()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayThiefChoosesCard", () => {
    it("should create game play thief chooses card when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: RoleNames.THIEF }),
        action: GamePlayActions.CHOOSE_CARD,
      });

      expect(createGamePlayThiefChoosesCard()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayStutteringJudgeChoosesSign", () => {
    it("should create game play stuttering judge chooses sign when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: RoleNames.STUTTERING_JUDGE }),
        action: GamePlayActions.CHOOSE_SIGN,
      });

      expect(createGamePlayStutteringJudgeChoosesSign()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayScapegoatBansVoting", () => {
    it("should create game play scapegoat bans voting when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: RoleNames.SCAPEGOAT }),
        action: GamePlayActions.BAN_VOTING,
      });

      expect(createGamePlayScapegoatBansVoting()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayDogWolfChoosesSide", () => {
    it("should create game play dog wolf chooses side when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: RoleNames.DOG_WOLF }),
        action: GamePlayActions.CHOOSE_SIDE,
      });

      expect(createGamePlayDogWolfChoosesSide()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayWildChildChoosesModel", () => {
    it("should create game play wild child chooses model when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: RoleNames.WILD_CHILD }),
        action: GamePlayActions.CHOOSE_MODEL,
      });

      expect(createGamePlayWildChildChoosesModel()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayFoxSniffs", () => {
    it("should create game play fox sniffs when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: RoleNames.FOX }),
        action: GamePlayActions.SNIFF,
      });

      expect(createGamePlayFoxSniffs()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayCharmedMeetEachOther", () => {
    it("should create game play charmed players meet each other when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: PlayerGroups.CHARMED }),
        action: GamePlayActions.MEET_EACH_OTHER,
      });

      expect(createGamePlayCharmedMeetEachOther()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayLoversMeetEachOther", () => {
    it("should create game play lovers meet each other when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: PlayerGroups.LOVERS }),
        action: GamePlayActions.MEET_EACH_OTHER,
      });

      expect(createGamePlayLoversMeetEachOther()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayThreeBrothersMeetEachOther", () => {
    it("should create game play three brothers meet each other when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: RoleNames.THREE_BROTHERS }),
        action: GamePlayActions.MEET_EACH_OTHER,
      });

      expect(createGamePlayThreeBrothersMeetEachOther()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayTwoSistersMeetEachOther", () => {
    it("should create game play two sisters meet each other when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: RoleNames.TWO_SISTERS }),
        action: GamePlayActions.MEET_EACH_OTHER,
      });

      expect(createGamePlayTwoSistersMeetEachOther()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayRavenMarks", () => {
    it("should create game play raven marks when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: RoleNames.RAVEN }),
        action: GamePlayActions.MARK,
      });

      expect(createGamePlayRavenMarks()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayGuardProtects", () => {
    it("should create game play guard protects when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: RoleNames.GUARD }),
        action: GamePlayActions.PROTECT,
      });

      expect(createGamePlayGuardProtects()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayHunterShoots", () => {
    it("should create game play hunter shoots when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: RoleNames.HUNTER }),
        action: GamePlayActions.SHOOT,
      });

      expect(createGamePlayHunterShoots()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayWitchUsesPotions", () => {
    it("should create game play witch uses potions when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: RoleNames.WITCH }),
        action: GamePlayActions.USE_POTIONS,
      });

      expect(createGamePlayWitchUsesPotions()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayPiedPiperCharms", () => {
    it("should create game play pied piper charms when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: RoleNames.PIED_PIPER }),
        action: GamePlayActions.CHARM,
      });

      expect(createGamePlayPiedPiperCharms()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayCupidCharms", () => {
    it("should create game play cupid charms when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: RoleNames.CUPID }),
        action: GamePlayActions.CHARM,
      });

      expect(createGamePlayCupidCharms()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlaySeerLooks", () => {
    it("should create game play seer looks when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: RoleNames.SEER }),
        action: GamePlayActions.LOOK,
      });

      expect(createGamePlaySeerLooks()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayWhiteWerewolfEats", () => {
    it("should create game play white werewolf eats when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: RoleNames.WHITE_WEREWOLF }),
        action: GamePlayActions.EAT,
      });

      expect(createGamePlayWhiteWerewolfEats()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayBigBadWolfEats", () => {
    it("should create game play big bad wolf eats when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: RoleNames.BIG_BAD_WOLF }),
        action: GamePlayActions.EAT,
      });

      expect(createGamePlayBigBadWolfEats()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayWerewolvesEat", () => {
    it("should create game play werewolves eat when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: PlayerGroups.WEREWOLVES }),
        action: GamePlayActions.EAT,
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

      expect(createGamePlaySource(gamePlaySource)).toStrictEqual<GamePlaySource>(plainToInstance(GamePlaySource, {
        name: RoleNames.SEER,
        players: gamePlaySource.players,
      }));
    });
  });

  describe("createGamePlay", () => {
    it("should create game play when called.", () => {
      const gamePlay: GamePlay = {
        source: createFakeGamePlaySource({ name: RoleNames.WILD_CHILD }),
        action: GamePlayActions.CHOOSE_MODEL,
      };

      expect(createGamePlay(gamePlay)).toStrictEqual<GamePlay>(plainToInstance(GamePlay, {
        source: createGamePlaySource({ name: RoleNames.WILD_CHILD }),
        action: GamePlayActions.CHOOSE_MODEL,
      }));
    });
  });
});