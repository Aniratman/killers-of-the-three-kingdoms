import { GameStage } from './GameEvent';
import { theGameManager } from './GameManager';
import GamePlayer from './GamePlayer';

export const PlayerHandler: { [index: string]: Function } = {
    registerEvents: function registerEvents() {
        const self: GamePlayer = this;
        theGameManager.addEventListener(GameStage.GAME_START, self, this.handleGameStart);
        theGameManager.addEventListener(GameStage.GAME_ALL_BEGIN, self, this.handleAllBegin);
        theGameManager.addEventListener(GameStage.GAME_SINGLE_PREPARE, self, this.handleSinglePrepare);
        theGameManager.addEventListener(GameStage.GAME_SINGLE_JUDGE, self, this.handleSingleJudge);
        theGameManager.addEventListener(GameStage.GAME_SINGLE_DEAL_CARD, self, this.handleSingleDealCard);
        theGameManager.addEventListener(GameStage.GAME_SINGLE_PLAY_CARD, self, this.handleSinglePlayCard);
        theGameManager.addEventListener(GameStage.GAME_SINGLE_GARBAGE_CARD, self, this.handleSingleGarbageCard);
        theGameManager.addEventListener(GameStage.GAME_SINGLE_FINISH, self, this.handleSingleFinish);
        theGameManager.addEventListener(GameStage.GAME_ALL_FINISH, self, this.handleAllFinish);
        theGameManager.addEventListener(GameStage.GAME_END, self, this.handleGameEnd);
    },

    handleGameStart: function handleGameStart(player: GamePlayer) {
        // todo: 此阶段有无技能可发动，默认直接响应
        const self: GamePlayer = this;

        theGameManager.isResponse = true;
    },

    handleAllBegin: function handleAllBegin(player: GamePlayer) {
        // todo: 此阶段有无技能可发动，默认直接响应
        const self: GamePlayer = this;

        theGameManager.isResponse = true;
    },

    handleSinglePrepare: function handleSinglePrepare(player: GamePlayer) {
        // todo: 准备阶段有无技能可发动，默认直接响应
        const self: GamePlayer = this;

        theGameManager.isResponse = true;
    },

    handleSingleJudge: function handleSingleJudge(player: GamePlayer) {
        // todo: 判定区是否有牌，有牌则开始响应无懈可击
        // todo: 无懈可击未响应则检测技能，默认直接响应
        const self: GamePlayer = this;

        theGameManager.isResponse = true;
    },

    handleSingleDealCard: function handleSingleDealCard(player: GamePlayer) {
        // todo: 摸牌阶段有无技能可发动，默认直接响应
        const self: GamePlayer = this;

        if (player !== self) {
            theGameManager.isResponse = true;
            return;
        }
        const cards = theGameManager.dealCards(2);
        self.gainCards(cards);
        theGameManager.isResponse = true;
    },

    handleSinglePlayCard: function handleSinglePlayCard(player: GamePlayer) {
        // todo: 出牌段有无技能可发动，默认直接响应
        const self: GamePlayer = this;

        theGameManager.isResponse = true;
    },

    handleSingleGarbageCard: function handleSingleGarbageCard(player: GamePlayer) {
        // todo: 弃牌阶段有无技能可发动，默认直接响应
        const self: GamePlayer = this;

        theGameManager.isResponse = true;
    },

    handleSingleFinish: function handleSingleFinish(player: GamePlayer) {
        // todo: 结束阶段有无技能可发动，默认直接响应
        const self: GamePlayer = this;

        theGameManager.isResponse = true;
    },

    handleAllFinish: function handleAllFinish(player: GamePlayer) {
        // todo: 此阶段有无技能可发动，默认直接响应
        const self: GamePlayer = this;

        theGameManager.isResponse = true;
    },

    handleGameEnd: function handleGameEnd(player: GamePlayer) {
        // todo: 此阶段有无技能可发动，默认直接响应
        const self: GamePlayer = this;

        theGameManager.isResponse = true;
    },
};

export function externGamePlayerHandlers(fromObj?: { [index: string]: Function }) {
    for (const key in fromObj) {
        if (Object.prototype.hasOwnProperty.call(fromObj, key)) {
            const success = Reflect.defineProperty(GamePlayer.prototype, key, {
                value: fromObj[key],
                writable: false,
            });

            if (!success) {
                console.error(`can't set property:${key} to GamePlayer`);
            }
        }
    }
}
