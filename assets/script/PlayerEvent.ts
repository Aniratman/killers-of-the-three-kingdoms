import EventHub from './EventHub';
import GamePlayer from './GamePlayer';

export enum PlayerBehavior {
    USE_KILL, // 杀
    USE_DODGE, // 闪
    USE_PEACH, // 桃
    USE_WINE, // 酒
    FEELS_GOOD, // 决斗
    KICK_DOWN_THE_LADDER, // 过河拆桥
    GO_ON_THE_SCAMP, // 顺手牵羊
    THOUSANND_ARROWS_SHOT, // 万箭齐发
    BARBARIAN_BREAKOUT, // 南蛮入侵
    GRAIN_GRIEVED, // 兵粮寸断

    REDUCE_HP, // 受到伤害
    LOSE_HP, // 流失体力
    REDUCE_MAX_HP, // 扣除体力上限
}

export default class PlayerEvent {
    private __eventHub: EventHub<PlayerBehavior> = null;

    constructor() {
        this.__eventHub = new EventHub();
    }

    addEventListener(id: PlayerBehavior, object: GamePlayer, callback: Function) {
        this.__eventHub.addEventListener(id, object, callback);
    }

    triggerEventListener(id: PlayerBehavior, object?: GamePlayer, ...args) {
        return this.__eventHub.triggerEventListener(id, object, ...args);
    }

    removeEventListener(id: PlayerBehavior, object?: GamePlayer) {
        this.__eventHub.removeEventListener(id, object);
    }

    removeListnerByObject(object: Object) {
        this.__eventHub.removeListnerByObject(object);
    }

    removeAllEventListeners() {
        this.__eventHub.removeAllEventListeners();
    }
}
