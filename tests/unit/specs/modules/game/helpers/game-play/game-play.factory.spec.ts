import { plainToInstance } from "class-transformer";

import { GAME_PLAY_ACTIONS } from "@/modules/game/enums/game-play.enum";
import { PLAYER_ATTRIBUTE_NAMES, PLAYER_GROUPS } from "@/modules/game/enums/player.enum";
import { createGamePlay, createGamePlayAllElectSheriff, createGamePlayAllVote, createGamePlayBigBadWolfEats, createGamePlayCharmedMeetEachOther, createGamePlayCupidCharms, createGamePlayDogWolfChoosesSide, createGamePlayFoxSniffs, createGamePlayGuardProtects, createGamePlayHunterShoots, createGamePlayLoversMeetEachOther, createGamePlayPiedPiperCharms, createGamePlayRavenMarks, createGamePlayScapegoatBansVoting, createGamePlaySeerLooks, createGamePlaySheriffDelegates, createGamePlaySheriffSettlesVotes, createGamePlaySource, createGamePlayStutteringJudgeChoosesSign, createGamePlayThiefChoosesCard, createGamePlayThreeBrothersMeetEachOther, createGamePlayTwoSistersMeetEachOther, createGamePlayWerewolvesEat, createGamePlayWhiteWerewolfEats, createGamePlayWildChildChoosesModel, createGamePlayWitchUsesPotions } from "@/modules/game/helpers/game-play/game-play.factory";
import { GamePlaySource } from "@/modules/game/schemas/game-play/game-play-source/game-play-source.schema";
import { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import { ROLE_NAMES } from "@/modules/role/enums/role.enum";

import { createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";
import { createFakeGamePlay } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGamePlaySource } from "@tests/factories/game/schemas/game-play/game-play-source.schema.factory";

describe("Game Play Factory", () => {
  describe("createGamePlaySheriffSettlesVotes", () => {
    it("should create game play sheriff settles votes when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: PLAYER_ATTRIBUTE_NAMES.SHERIFF }),
        action: GAME_PLAY_ACTIONS.SETTLE_VOTES,
      });

      expect(createGamePlaySheriffSettlesVotes()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlaySheriffDelegates", () => {
    it("should create game play sheriff delegates when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: PLAYER_ATTRIBUTE_NAMES.SHERIFF }),
        action: GAME_PLAY_ACTIONS.DELEGATE,
      });

      expect(createGamePlaySheriffDelegates()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayAllVote", () => {
    it("should create game play all vote when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: PLAYER_GROUPS.ALL }),
        action: GAME_PLAY_ACTIONS.VOTE,
      });

      expect(createGamePlayAllVote()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayAllElectSheriff", () => {
    it("should create game play all elect sheriff when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: PLAYER_GROUPS.ALL }),
        action: GAME_PLAY_ACTIONS.ELECT_SHERIFF,
      });

      expect(createGamePlayAllElectSheriff()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayThiefChoosesCard", () => {
    it("should create game play thief chooses card when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: ROLE_NAMES.THIEF }),
        action: GAME_PLAY_ACTIONS.CHOOSE_CARD,
      });

      expect(createGamePlayThiefChoosesCard()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayStutteringJudgeChoosesSign", () => {
    it("should create game play stuttering judge chooses sign when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: ROLE_NAMES.STUTTERING_JUDGE }),
        action: GAME_PLAY_ACTIONS.CHOOSE_SIGN,
      });

      expect(createGamePlayStutteringJudgeChoosesSign()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayScapegoatBansVoting", () => {
    it("should create game play scapegoat bans voting when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: ROLE_NAMES.SCAPEGOAT }),
        action: GAME_PLAY_ACTIONS.BAN_VOTING,
      });

      expect(createGamePlayScapegoatBansVoting()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayDogWolfChoosesSide", () => {
    it("should create game play dog wolf chooses side when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: ROLE_NAMES.DOG_WOLF }),
        action: GAME_PLAY_ACTIONS.CHOOSE_SIDE,
      });

      expect(createGamePlayDogWolfChoosesSide()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayWildChildChoosesModel", () => {
    it("should create game play wild child chooses model when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: ROLE_NAMES.WILD_CHILD }),
        action: GAME_PLAY_ACTIONS.CHOOSE_MODEL,
      });

      expect(createGamePlayWildChildChoosesModel()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayFoxSniffs", () => {
    it("should create game play fox sniffs when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: ROLE_NAMES.FOX }),
        action: GAME_PLAY_ACTIONS.SNIFF,
      });

      expect(createGamePlayFoxSniffs()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayCharmedMeetEachOther", () => {
    it("should create game play charmed players meet each other when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: PLAYER_GROUPS.CHARMED }),
        action: GAME_PLAY_ACTIONS.MEET_EACH_OTHER,
      });

      expect(createGamePlayCharmedMeetEachOther()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayLoversMeetEachOther", () => {
    it("should create game play lovers meet each other when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: PLAYER_GROUPS.LOVERS }),
        action: GAME_PLAY_ACTIONS.MEET_EACH_OTHER,
      });

      expect(createGamePlayLoversMeetEachOther()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayThreeBrothersMeetEachOther", () => {
    it("should create game play three brothers meet each other when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: ROLE_NAMES.THREE_BROTHERS }),
        action: GAME_PLAY_ACTIONS.MEET_EACH_OTHER,
      });

      expect(createGamePlayThreeBrothersMeetEachOther()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayTwoSistersMeetEachOther", () => {
    it("should create game play two sisters meet each other when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: ROLE_NAMES.TWO_SISTERS }),
        action: GAME_PLAY_ACTIONS.MEET_EACH_OTHER,
      });

      expect(createGamePlayTwoSistersMeetEachOther()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayRavenMarks", () => {
    it("should create game play raven marks when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: ROLE_NAMES.RAVEN }),
        action: GAME_PLAY_ACTIONS.MARK,
      });

      expect(createGamePlayRavenMarks()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayGuardProtects", () => {
    it("should create game play guard protects when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: ROLE_NAMES.GUARD }),
        action: GAME_PLAY_ACTIONS.PROTECT,
      });

      expect(createGamePlayGuardProtects()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayHunterShoots", () => {
    it("should create game play hunter shoots when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: ROLE_NAMES.HUNTER }),
        action: GAME_PLAY_ACTIONS.SHOOT,
      });

      expect(createGamePlayHunterShoots()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayWitchUsesPotions", () => {
    it("should create game play witch uses potions when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: ROLE_NAMES.WITCH }),
        action: GAME_PLAY_ACTIONS.USE_POTIONS,
      });

      expect(createGamePlayWitchUsesPotions()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayPiedPiperCharms", () => {
    it("should create game play pied piper charms when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: ROLE_NAMES.PIED_PIPER }),
        action: GAME_PLAY_ACTIONS.CHARM,
      });

      expect(createGamePlayPiedPiperCharms()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayCupidCharms", () => {
    it("should create game play cupid charms when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: ROLE_NAMES.CUPID }),
        action: GAME_PLAY_ACTIONS.CHARM,
      });

      expect(createGamePlayCupidCharms()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlaySeerLooks", () => {
    it("should create game play seer looks when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: ROLE_NAMES.SEER }),
        action: GAME_PLAY_ACTIONS.LOOK,
      });

      expect(createGamePlaySeerLooks()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayWhiteWerewolfEats", () => {
    it("should create game play white werewolf eats when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: ROLE_NAMES.WHITE_WEREWOLF }),
        action: GAME_PLAY_ACTIONS.EAT,
      });

      expect(createGamePlayWhiteWerewolfEats()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayBigBadWolfEats", () => {
    it("should create game play big bad wolf eats when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: ROLE_NAMES.BIG_BAD_WOLF }),
        action: GAME_PLAY_ACTIONS.EAT,
      });

      expect(createGamePlayBigBadWolfEats()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlayWerewolvesEat", () => {
    it("should create game play werewolves eat when called.", () => {
      const expectedGamePlay = createFakeGamePlay({
        source: createFakeGamePlaySource({ name: PLAYER_GROUPS.WEREWOLVES }),
        action: GAME_PLAY_ACTIONS.EAT,
      });

      expect(createGamePlayWerewolvesEat()).toStrictEqual<GamePlay>(expectedGamePlay);
    });
  });

  describe("createGamePlaySource", () => {
    it("should create game play source when called.", () => {
      const gamePlaySource = {
        name: ROLE_NAMES.SEER,
        players: [createFakePlayer()],
        tata: "toto",
      };

      expect(createGamePlaySource(gamePlaySource)).toStrictEqual<GamePlaySource>(plainToInstance(GamePlaySource, {
        name: ROLE_NAMES.SEER,
        players: gamePlaySource.players,
      }));
    });
  });

  describe("createGamePlay", () => {
    it("should create game play when called.", () => {
      const gamePlay: GamePlay = {
        source: createFakeGamePlaySource({ name: ROLE_NAMES.WILD_CHILD }),
        action: GAME_PLAY_ACTIONS.CHOOSE_MODEL,
      };

      expect(createGamePlay(gamePlay)).toStrictEqual<GamePlay>(plainToInstance(GamePlay, {
        source: createGamePlaySource({ name: ROLE_NAMES.WILD_CHILD }),
        action: GAME_PLAY_ACTIONS.CHOOSE_MODEL,
      }));
    });
  });
});