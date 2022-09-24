import { NumberIndexSet } from '../common/CommonStructs';
import EventHub from '../common/EventHub';
import { Utility } from '../common/Utility';
import GamePlayer from '../game/GamePlayer';
import { theGameManager } from './GameManager';

export enum PlayerBehavior {
    KILL_OTHER, // 杀
    DODGE_DAMAGE, // 闪
    RECOVER_HP, // 桃
    STRENGTHEN_DAMAGE, // 酒

    ATTACK_WITH_FIRE, // 火攻
    DULE_WITH_OTHER, // 决斗
    TEAR_DOWN_OTHER, // 过河拆桥
    GRAB_FROM_OTHER, // 顺手牵羊
    SHARE_WITH_ALL, // 五谷丰登
    OUT_OF_THIN_AIR, // 无中生有
    THOUSANND_ARROWS_SHOT, // 万箭齐发
    BARBARIAN_BREAKOUT, // 南蛮入侵
    LOCK_OTHER_BY_CHAIN, // 铁索连环
    BORROW_KNIFE, // 借刀杀人
    RECOVER_TOGETHER, // 桃园结义
    SUPER_CANCEL, // 无懈可击
    GRAIN_GRIEVED, // 兵粮寸断
    NO_HOMESICK, // 乐不思蜀
    SUMMON_THUNDER, // 闪电

    USE_EQUIP, // 装备

    REDUCE_HP, // 受到伤害
    LOSE_HP, // 流失体力
    REDUCE_MAX_HP, // 扣除体力上限

    BEFORE_CARD_RESPONSE, // 卡牌结算前，比如顺手牵羊指定玩家后
    AFTER_CARD_RESPONSE, // 卡牌响应后，比如顺手牵羊获得玩家牌后

    SINGLE_BEHAVIOR_FINISH, // 单次玩家行为结算，比如玩家打出南蛮入侵到所有玩家响应南蛮入侵结束
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

export const BehaviorChecker: NumberIndexSet<(own: GamePlayer, others?: GamePlayer[]) => boolean> = {
    [PlayerBehavior.KILL_OTHER](own, others?: GamePlayer[]) {
        for (const player of others) {
            if (theGameManager.calculateAttackDistanceOfPlayers(own, player) > 0) {
                return false;
            }
        }
        return true;
    },
    [PlayerBehavior.DODGE_DAMAGE](own, others?: GamePlayer[]) {
        return true;
    },
    [PlayerBehavior.RECOVER_HP](own, others?: GamePlayer[]) {
        return own.curHp < own.maxHp;
    },
    [PlayerBehavior.STRENGTHEN_DAMAGE](own, others?: GamePlayer[]) {
        return own.useWineNum <= 0;
    },
    [PlayerBehavior.ATTACK_WITH_FIRE](own, others?: GamePlayer[]) {
        const [player] = others;
        return player.handCards.length > 0;
    },
    [PlayerBehavior.DULE_WITH_OTHER](own, others?: GamePlayer[]) {
        return true;
    },
    [PlayerBehavior.TEAR_DOWN_OTHER](own, others?: GamePlayer[]) {
        const [player] = others;
        return player.handCards.length + player.equips.length + player.judgeCards.length > 0;
    },
    [PlayerBehavior.GRAB_FROM_OTHER](own, others?: GamePlayer[]) {
        const [player] = others;
        if (theGameManager.calculateAttackDistanceOfPlayers(own, player) > 0) {
            return false;
        }
        return player.handCards.length + player.equips.length + player.judgeCards.length > 0;
    },
    [PlayerBehavior.SHARE_WITH_ALL](own, others?: GamePlayer[]) {
        return true;
    },
    [PlayerBehavior.OUT_OF_THIN_AIR](own, others?: GamePlayer[]) {
        return true;
    },
    [PlayerBehavior.THOUSANND_ARROWS_SHOT](own, others?: GamePlayer[]) {
        return true;
    },
    [PlayerBehavior.BARBARIAN_BREAKOUT](own, others?: GamePlayer[]) {
        return true;
    },
    [PlayerBehavior.LOCK_OTHER_BY_CHAIN](own, others?: GamePlayer[]) {
        return true;
    },
    [PlayerBehavior.BORROW_KNIFE](own, others?: GamePlayer[]) {
        const [player] = others;
        const index = Utility.indexOf(player.equips, (equip) => equip.isWeapon());
        return index >= 0;
    },
    [PlayerBehavior.RECOVER_TOGETHER](own, others?: GamePlayer[]) {
        return true;
    },
    [PlayerBehavior.SUPER_CANCEL](own, others?: GamePlayer[]) {
        return true;
    },
    [PlayerBehavior.GRAIN_GRIEVED](own, others?: GamePlayer[]) {
        const [player] = others;
        if (theGameManager.calculateAttackDistanceOfPlayers(own, player) > 0) {
            return false;
        }
        return true;
    },
    [PlayerBehavior.NO_HOMESICK](own, others?: GamePlayer[]) {
        return true;
    },
    [PlayerBehavior.SUMMON_THUNDER](own, others?: GamePlayer[]) {
        return true;
    },
    [PlayerBehavior.USE_EQUIP](own, others?: GamePlayer[]) {
        return true;
    },
};

export function checkBehaviorValid(behavior: PlayerBehavior, own: GamePlayer, others: GamePlayer[]) {
    if (!BehaviorChecker[behavior]) {
        return false;
    }
    return BehaviorChecker[behavior](own, others);
}
