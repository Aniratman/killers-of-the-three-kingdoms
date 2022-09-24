import { StringIndexSet } from '../common/CommonStructs';
import { GameStage } from '../controler/GameEvent';
import { theGameManager } from '../controler/GameManager';
import GamePlayer from './GamePlayer';

export const StageHandler: StringIndexSet<Function> = {
    registerStageEvents: function registerStageEvents() {
        theGameManager.addEventListener(GameStage.GAME_START, this, this.handleGameStart);
        theGameManager.addEventListener(GameStage.GAME_ROUND_BEGIN, this, this.handleRoundBegin);
        theGameManager.addEventListener(GameStage.GAME_PERSONAL_PREPARE, this, this.handlePersonalPrepare);
        theGameManager.addEventListener(GameStage.GAME_PERSONAL_JUDGE, this, this.handlePersonalJudge);
        theGameManager.addEventListener(GameStage.GAME_PERSONAL_DEAL_CARD, this, this.handlePersonalDealCard);
        theGameManager.addEventListener(GameStage.GAME_PERSONAL_PLAY_CARD, this, this.handlePersonalPlayCard);
        theGameManager.addEventListener(GameStage.GAME_PERSONAL_LOSE_CARD, this, this.handlePersonalLoseCard);
        theGameManager.addEventListener(GameStage.GAME_PERSONAL_FINISH, this, this.handlePersonalFinish);
        theGameManager.addEventListener(GameStage.GAME_ROUND_FINISH, this, this.handleRoundFinish);
        theGameManager.addEventListener(GameStage.GAME_END, this, this.handleGameEnd);
    },

    handleGameStart: function handleGameStart(this: GamePlayer, player: GamePlayer) {
        // todo: 此阶段有无技能可发动，默认直接响应

        if (this.robot && this.robot.enabled) {
            this.robot.handleGameStart(player);
            return;
        }

        theGameManager.setResponse(true);
    },

    handleRoundBegin: function handleRoundBegin(this: GamePlayer, player: GamePlayer) {
        // todo: 此阶段有无技能可发动，默认直接响应

        if (this.robot && this.robot.enabled) {
            this.robot.handleRoundBegin(player);
            return;
        }

        theGameManager.setResponse(true);
    },

    handlePersonalPrepare: function handlePersonalPrepare(this: GamePlayer, player: GamePlayer) {
        // todo: 准备阶段有无技能可发动，默认直接响应

        if (this.robot && this.robot.enabled) {
            this.robot.handlePersonalPrepare(player);
            return;
        }

        theGameManager.setResponse(true);
    },

    handlePersonalJudge: function handlePersonalJudge(this: GamePlayer, player: GamePlayer) {
        // todo: 判定区是否有牌，有牌则开始响应无懈可击
        // todo: 无懈可击未响应则检测技能，默认直接响应

        if (this.robot && this.robot.enabled) {
            this.robot.handlePersonalJudge(player);
            return;
        }

        theGameManager.setResponse(true);
    },

    handlePersonalDealCard: function handlePersonalDealCard(this: GamePlayer, player: GamePlayer) {
        // todo: 摸牌阶段有无技能可发动，默认直接响应

        if (this.robot && this.robot.enabled) {
            this.robot.handlePersonalDealCard(player);
            return;
        }

        if (player !== this) {
            theGameManager.setResponse(true);
            return;
        }
        const cards = theGameManager.dealCards(2);
        this.gainCards(cards);
        theGameManager.setResponse(true);
    },

    handlePersonalPlayCard: function handlePersonalPlayCard(this: GamePlayer, player: GamePlayer) {
        // todo: 出牌段有无技能可发动，默认直接响应

        if (this.robot && this.robot.enabled) {
            this.robot.handlePersonalPlayCard(player);
            return;
        }

        theGameManager.setResponse(true);
    },

    handlePersonalLoseCard: function handlePersonalLoseCard(this: GamePlayer, player: GamePlayer) {
        // todo: 弃牌阶段有无技能可发动，默认直接响应

        if (this.robot && this.robot.enabled) {
            this.robot.handlePersonalLoseCard(player);
            return;
        }

        theGameManager.setResponse(true);
    },

    handlePersonalFinish: function handlePersonalFinish(this: GamePlayer, player: GamePlayer) {
        // todo: 结束阶段有无技能可发动，默认直接响应

        if (this.robot && this.robot.enabled) {
            this.robot.handlePersonalFinish(player);
            return;
        }

        theGameManager.setResponse(true);
    },

    handleRoundFinish: function handleRoundFinish(this: GamePlayer, player: GamePlayer) {
        // todo: 此阶段有无技能可发动，默认直接响应

        if (this.robot && this.robot.enabled) {
            this.robot.handleRoundFinish(player);
            return;
        }

        theGameManager.setResponse(true);
    },

    handleGameEnd: function handleGameEnd(this: GamePlayer, player: GamePlayer) {
        // todo: 此阶段有无技能可发动，默认直接响应

        if (this.robot && this.robot.enabled) {
            this.robot.handleGameEnd(player);
            return;
        }

        theGameManager.setResponse(true);
    },
};

export function externGamePlayerFunctions(fromObj: StringIndexSet<Function>) {
    for (const key in fromObj) {
        if (Object.prototype.hasOwnProperty.call(fromObj, key)) {
            const success = Reflect.defineProperty(GamePlayer.prototype, key, {
                value: fromObj[key],
                writable: false,
            });

            if (!success) {
                console.error(`can't set property:${key} for GamePlayer`);
            }
        }
    }
}
