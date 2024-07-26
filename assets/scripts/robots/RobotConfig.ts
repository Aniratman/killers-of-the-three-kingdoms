import { ClassConstructor, Identity, NumberIndexSet } from '../common/CommonStructs';
import Robot from './Robot';
import RobotLord from './RobotEmperor';
import RobotLoyola from './RobotMinister';
import RobotRebel from './RobotRebel';
import RobotTraitor from './RobotProvocateur';
import { PlayerBehavior } from '../controler/BehaviorEvent';

export const RobotConfig: NumberIndexSet<ClassConstructor<Robot>> = {
    [Identity.Emperor]: RobotLord,
    [Identity.Minister]: RobotLoyola,
    [Identity.Rebel]: RobotRebel,
    [Identity.Provocateur]: RobotTraitor,
};

export enum BehaviorPriority {
    HIGH,
    MIDDLE,
    LOW,
}

// 出牌优先级，排在前先打出
export const PLAY_CARD_PRIORITY: PlayerBehavior[] = [
    PlayerBehavior.ATTACK_WITH_FIRE,
    PlayerBehavior.USE_EQUIP,

    PlayerBehavior.BORROW_KNIFE,

    PlayerBehavior.TEAR_DOWN_OTHER,
    PlayerBehavior.GRAB_FROM_OTHER,

    PlayerBehavior.OUT_OF_THIN_AIR,

    PlayerBehavior.THOUSANND_ARROWS_SHOT,

    PlayerBehavior.BARBARIAN_BREAKOUT,
    PlayerBehavior.DULE_WITH_OTHER,

    PlayerBehavior.LOCK_OTHER_BY_CHAIN,
    PlayerBehavior.STRENGTHEN_DAMAGE,
    PlayerBehavior.KILL_OTHER,

    PlayerBehavior.NO_HOMESICK,
    PlayerBehavior.GRAIN_GRIEVED,

    PlayerBehavior.SHARE_WITH_ALL,

    PlayerBehavior.RECOVER_HP,
    PlayerBehavior.RECOVER_TOGETHER,
    PlayerBehavior.SUMMON_THUNDER,

    PlayerBehavior.SUPER_CANCEL,
    PlayerBehavior.DODGE_DAMAGE,
];

// 弃牌优先级，排在前的先丢弃
export const LOSE_CARD_PRIORITY: PlayerBehavior[] = [
    PlayerBehavior.SUMMON_THUNDER,
    PlayerBehavior.LOCK_OTHER_BY_CHAIN,
    PlayerBehavior.SHARE_WITH_ALL,
    PlayerBehavior.RECOVER_TOGETHER,
    PlayerBehavior.BORROW_KNIFE,

    PlayerBehavior.ATTACK_WITH_FIRE,
    PlayerBehavior.DULE_WITH_OTHER,

    PlayerBehavior.USE_EQUIP,

    PlayerBehavior.BARBARIAN_BREAKOUT,
    PlayerBehavior.THOUSANND_ARROWS_SHOT,

    PlayerBehavior.TEAR_DOWN_OTHER,
    PlayerBehavior.GRAB_FROM_OTHER,

    PlayerBehavior.NO_HOMESICK,
    PlayerBehavior.GRAIN_GRIEVED,

    PlayerBehavior.OUT_OF_THIN_AIR,

    PlayerBehavior.SUPER_CANCEL,
    PlayerBehavior.KILL_OTHER,
    PlayerBehavior.DODGE_DAMAGE,
    PlayerBehavior.STRENGTHEN_DAMAGE,
    PlayerBehavior.RECOVER_HP,
];

export function convertListToSet(behaviors: PlayerBehavior[]) {
    const set: NumberIndexSet<PlayerBehavior> = {};
    for (let i = 0; i < behaviors.length; ++i) {
        set[behaviors[i]] = i;
    }
    return set;
}
