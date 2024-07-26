import GamePlayer from './GamePlayer';

export interface StageListener {
    registerStageEvents: () => void;
    handleGamePrepare: (player: GamePlayer) => void;
    handleGameStart: (player: GamePlayer) => void;
    handleRoundBegin: (player: GamePlayer) => void;
    handlePersonalPrepare: (player: GamePlayer) => void;
    handlePersonalJudge: (player: GamePlayer) => void;
    handlePersonalDealCard: (player: GamePlayer) => void;
    handlePersonalPlayCard: (player: GamePlayer) => void;
    handlePersonalLoseCard: (player: GamePlayer) => void;
    handlePersonalFinish: (player: GamePlayer) => void;
    handleRoundFinish: (player: GamePlayer) => void;
    handleGameEnd: (player: GamePlayer) => void;
}

export interface BehaviorListener {
    registerBehaviorEvents: () => void;
    handleResponseKill: (src: GamePlayer, ...args) => void;
    handleResponseDodge: (src: GamePlayer, ...args) => void;
    handleResponseRecoverHp: (src: GamePlayer, ...args) => void;
    handleResponseStrengthDamage: (src: GamePlayer, ...args) => void;
    handleResponseAttackWithFire: (src: GamePlayer, ...args) => void;
    handleResponseDuleWithOther: (src: GamePlayer, ...args) => void;
    handleResponseTearDownOther: (src: GamePlayer, ...args) => void;
    handleResponseGrabFromOther: (src: GamePlayer, ...args) => void;
    handleResponseShareWithAll: (src: GamePlayer, ...args) => void;
    handleResponseOutOfThinAir: (src: GamePlayer, ...args) => void;
    handleResponseThousandArrowsShot: (src: GamePlayer, ...args) => void;
    handleResponseBarbarianBreakout: (src: GamePlayer, ...args) => void;
    handleResponseLockOtherByChain: (src: GamePlayer, ...args) => void;
    handleResponseBorrowKnife: (src: GamePlayer, ...args) => void;
    handleResponseRecoverToghter: (src: GamePlayer, ...args) => void;
    handleResponseSuperCancel: (src: GamePlayer, ...args) => void;
    handleResponseGrainGrived: (src: GamePlayer, ...args) => void;
    handleResponseNoHomesick: (src: GamePlayer, ...args) => void;
    handleResponseSummonThunder: (src: GamePlayer, ...args) => void;
    handleResponseUseEquip: (src: GamePlayer, ...args) => void;
    handleSingleBehaviorFinish: (src: GamePlayer, ...args) => void;
}
