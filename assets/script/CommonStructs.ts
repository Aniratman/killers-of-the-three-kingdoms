export type ClassConstructor<T = typeof Object> = new (...args: any[]) => T;

export interface Character {
    id: number;
    name: string;
    country: number;
    sex: number;
    life: number;
    spells: number[];
}

export interface Card {
    id: number;
    name: string;
    cardType: number;
    cardSubType: number;
    number: number;
    color: number;
    distanceWeapon: number;
    distanceAttackHorse: number;
    distanceDefanceHorse: number;
    spell: number;
    pictureId: number;
}

export interface Spell {
    id: number;
    name: string;
    type: number;
    desc: string;
}

export enum Sex {
    MALE,
    FEAMLE,
}

export enum PokeColor {
    HERT = 1,
    DIAMOND = 2,
    SPADE = 3,
    CLUB = 4,
}

export enum CardType {
    BaseCard = 1,
    KitCard = 2,
    EquipCard = 3,
}

export enum CardSubType {
    Weapon = 1,
    Amor = 2,
    DefenceHorse = 3,
    AttackHorse = 4,
    DelayTimeKit = 5,
    FireKill = 6,
    ThunderKill = 7,
}

export enum Country {
    Wei = 1,
    Shu = 2,
    Wu = 3,
    Qun = 4,
}

export enum Identity {
    Lord,
    Loyola,
    Rabel,
    Traitor,
}

export enum SpellType {
    KILL_WINK_PEACH = 1, // 杀 酒 桃
    DODGE = 100001, // 闪
    NORMAL_KIT = 10, // 普通锦囊
    DELAY_TIME_KIT = 110010, // 延时类锦囊
    SUPER_CANCEL = 100010, // 无懈可击
    MANUAL_WEAPON = 100100, // 手动选择发动的装备技能
    PASSIVE_WEAPON = 110100, // 装备自带被动
    COMMON_SPELL = 101000, // 普通技
    AWAKENING_SPELL = 1111000, // 觉醒技
    IMMOBILE_SPELL = 111000, // 锁定技
    LIMITATIVE_SPELL = 1101000, // 限定技
}
