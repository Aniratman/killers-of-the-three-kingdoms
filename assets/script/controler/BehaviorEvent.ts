import EventHub from '../common/EventHub';
import GamePlayer from '../game/GamePlayer';

export enum PlayerBehavior {
    USE_KILL, // 杀
    USE_DODGE, // 闪
    USE_PEACH, // 桃
    USE_WINE, // 酒

    DULE_WITH_OTHER, // 决斗
    TEAR_DOWN_OTHER, // 过河拆桥
    GRAB_FROM_OTHER, // 顺手牵羊
    SHARE_WITH_ALL, // 五谷丰登
    OUT_OF_THIN_AIR, // 无中生有
    THOUSANND_ARROWS_SHOT, // 万箭齐发
    BARBARIAN_BREAKOUT, // 南蛮入侵
    SUPER_CANCEL, // 无懈可击
    GRAIN_GRIEVED, // 兵粮寸断
    NO_HOMESICK, // 乐不思蜀
    USE_THUNDER, // 闪电

    USE_EQUIP, // 装备

    REDUCE_HP, // 受到伤害
    LOSE_HP, // 流失体力
    REDUCE_MAX_HP, // 扣除体力上限
}

export default class BehaviorEvent {
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
