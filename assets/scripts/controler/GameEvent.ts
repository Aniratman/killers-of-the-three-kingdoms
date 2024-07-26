import EventHub from '../common/EventHub';
import GamePlayer from '../game/GamePlayer';

export enum GameStage {
    GAME_PREPARE, // 整局游戏准备阶段
    GAME_START, // 整局游戏开始
    GAME_ROUND_BEGIN, // 单轮游戏开始
    GAME_PERSONAL_PREPARE, // 单一玩家准备阶段
    GAME_PERSONAL_JUDGE, // 单一玩家判定阶段
    GAME_PERSONAL_DEAL_CARD, // 单一玩家摸牌阶段
    GAME_PERSONAL_PLAY_CARD, // 单一玩家出牌阶段
    GAME_PERSONAL_LOSE_CARD, // 单一玩家弃牌阶段
    GAME_PERSONAL_FINISH, // 单一玩家结束阶段
    GAME_ROUND_FINISH, // 单轮游戏结束
    GAME_END, // 整局游戏结束
}

export default class GameEvent {
    private __eventHub: EventHub<GameStage> = null;

    constructor() {
        this.__eventHub = new EventHub();
    }

    addEventListener(id: GameStage, object: GamePlayer, callback: Function) {
        this.__eventHub.addEventListener(id, object, callback);
    }

    triggerEventListener(id: GameStage, object?: GamePlayer, ...args) {
        return this.__eventHub.triggerEventListener(id, object, ...args);
    }

    removeEventListener(id: GameStage, object?: GamePlayer) {
        this.__eventHub.removeEventListener(id, object);
    }

    removeListnerByObject(object: Object) {
        this.__eventHub.removeListnerByObject(object);
    }

    removeAllEventListeners() {
        this.__eventHub.removeAllEventListeners();
    }
}
