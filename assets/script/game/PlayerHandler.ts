import { GameStage } from '../controler/GameEvent';
import { theGameManager } from '../controler/GameManager';
import GamePlayer from './GamePlayer';

export const PlayerHandler: { [index: string]: Function } = {
    registerEvents: function registerEvents() {
        const self: GamePlayer = this;
        theGameManager.addEventListener(GameStage.GAME_START, self, this.handleGameStart);
        theGameManager.addEventListener(GameStage.GAME_ROUND_BEGIN, self, this.handleRoundBegin);
        theGameManager.addEventListener(GameStage.GAME_PERSONAL_PREPARE, self, this.handlePersonalPrepare);
        theGameManager.addEventListener(GameStage.GAME_PERSONAL_JUDGE, self, this.handlePersonalJudge);
        theGameManager.addEventListener(GameStage.GAME_PERSONAL_DEAL_CARD, self, this.handlePersonalDealCard);
        theGameManager.addEventListener(GameStage.GAME_PERSONAL_PLAY_CARD, self, this.handlePersonalPlayCard);
        theGameManager.addEventListener(GameStage.GAME_PERSONAL_GARBAGE_CARD, self, this.handlePersonalGarbageCard);
        theGameManager.addEventListener(GameStage.GAME_PERSONAL_FINISH, self, this.handlePersonalFinish);
        theGameManager.addEventListener(GameStage.GAME_ROUND_FINISH, self, this.handleRoundFinish);
        theGameManager.addEventListener(GameStage.GAME_END, self, this.handleGameEnd);
    },

    handleGameStart: function handleGameStart(player: GamePlayer) {
        // todo: 此阶段有无技能可发动，默认直接响应
        const self: GamePlayer = this;
        if (self.robot && self.robot.enabled) {
            self.robot.handleGameStart(player);
            return;
        }

        theGameManager.isResponse = true;
    },

    handleRoundBegin: function handleRoundBegin(player: GamePlayer) {
        // todo: 此阶段有无技能可发动，默认直接响应
        const self: GamePlayer = this;
        if (self.robot && self.robot.enabled) {
            self.robot.handleRoundBegin(player);
            return;
        }

        theGameManager.isResponse = true;
    },

    handlePersonalPrepare: function handlePersonalPrepare(player: GamePlayer) {
        // todo: 准备阶段有无技能可发动，默认直接响应
        const self: GamePlayer = this;
        if (self.robot && self.robot.enabled) {
            self.robot.handlePersonalPrepare(player);
            return;
        }

        theGameManager.isResponse = true;
    },

    handlePersonalJudge: function handlePersonalJudge(player: GamePlayer) {
        // todo: 判定区是否有牌，有牌则开始响应无懈可击
        // todo: 无懈可击未响应则检测技能，默认直接响应
        const self: GamePlayer = this;
        if (self.robot && self.robot.enabled) {
            self.robot.handlePersonalJudge(player);
            return;
        }

        theGameManager.isResponse = true;
    },

    handlePersonalDealCard: function handlePersonalDealCard(player: GamePlayer) {
        // todo: 摸牌阶段有无技能可发动，默认直接响应
        const self: GamePlayer = this;
        if (self.robot && self.robot.enabled) {
            self.robot.handlePersonalDealCard(player);
            return;
        }

        if (player !== self) {
            theGameManager.isResponse = true;
            return;
        }
        const cards = theGameManager.dealCards(2);
        self.gainCards(cards);
        theGameManager.isResponse = true;
    },

    handlePersonalPlayCard: function handlePersonalPlayCard(player: GamePlayer) {
        // todo: 出牌段有无技能可发动，默认直接响应
        const self: GamePlayer = this;
        if (self.robot && self.robot.enabled) {
            self.robot.handlePersonalPlayCard(player);
            return;
        }

        theGameManager.isResponse = true;
    },

    handlePersonalGarbageCard: function handlePersonalGarbageCard(player: GamePlayer) {
        // todo: 弃牌阶段有无技能可发动，默认直接响应
        const self: GamePlayer = this;
        if (self.robot && self.robot.enabled) {
            self.robot.handlePersonalGarbageCard(player);
            return;
        }

        theGameManager.isResponse = true;
    },

    handlePersonalFinish: function handlePersonalFinish(player: GamePlayer) {
        // todo: 结束阶段有无技能可发动，默认直接响应
        const self: GamePlayer = this;
        if (self.robot && self.robot.enabled) {
            self.robot.handlePersonalFinish(player);
            return;
        }

        theGameManager.isResponse = true;
    },

    handleRoundFinish: function handleRoundFinish(player: GamePlayer) {
        // todo: 此阶段有无技能可发动，默认直接响应
        const self: GamePlayer = this;
        if (self.robot && self.robot.enabled) {
            self.robot.handleRoundFinish(player);
            return;
        }

        theGameManager.isResponse = true;
    },

    handleGameEnd: function handleGameEnd(player: GamePlayer) {
        // todo: 此阶段有无技能可发动，默认直接响应
        const self: GamePlayer = this;
        if (self.robot && self.robot.enabled) {
            self.robot.handleGameEnd(player);
            return;
        }

        theGameManager.isResponse = true;
    },
};

export function externGamePlayerFunctions(fromObj: { [index: string]: Function }) {
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
