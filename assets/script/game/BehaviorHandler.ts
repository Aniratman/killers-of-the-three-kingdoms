import { StringIndexSet } from '../common/CommonStructs';
import { PlayerBehavior } from '../controler/BehaviorEvent';
import { GeneratorBehavior, theBehaviorManager } from '../controler/BehaviorManager';
import GamePlayer from './GamePlayer';

export const BehaviorHandler: StringIndexSet<Function> = {
    registerBehaviorEvents() {
        theBehaviorManager.addEventListener(PlayerBehavior.KILL_OTHER, this, this.handleResponseKill);
        theBehaviorManager.addEventListener(PlayerBehavior.DODGE_DAMAGE, this, this.handleResponseDodge);
        theBehaviorManager.addEventListener(PlayerBehavior.RECOVER_HP, this, this.handleResponseRecoverHp);
        theBehaviorManager.addEventListener(PlayerBehavior.STRENGTHEN_DAMAGE, this, this.handleResponseStrengthDamage);
        theBehaviorManager.addEventListener(PlayerBehavior.ATTACK_WITH_FIRE, this, this.handleResponseAttackWithFire);
        theBehaviorManager.addEventListener(PlayerBehavior.DULE_WITH_OTHER, this, this.handleResponseDuleWithOther);
        theBehaviorManager.addEventListener(PlayerBehavior.TEAR_DOWN_OTHER, this, this.handleResponseTearDownOther);
        theBehaviorManager.addEventListener(PlayerBehavior.GRAB_FROM_OTHER, this, this.handleResponseGrabFromOther);
        theBehaviorManager.addEventListener(PlayerBehavior.SHARE_WITH_ALL, this, this.handleResponseShareWithAll);
        theBehaviorManager.addEventListener(PlayerBehavior.OUT_OF_THIN_AIR, this, this.handleResponseOutOfThinAir);
        theBehaviorManager.addEventListener(PlayerBehavior.THOUSANND_ARROWS_SHOT, this, this.handleResponseThousandArrowsShot);
        theBehaviorManager.addEventListener(PlayerBehavior.BARBARIAN_BREAKOUT, this, this.handleResponseBarbarianBreakout);
        theBehaviorManager.addEventListener(PlayerBehavior.LOCK_OTHER_BY_CHAIN, this, this.handleResponseLockOtherByChain);
        theBehaviorManager.addEventListener(PlayerBehavior.BORROW_KNIFE, this, this.handleResponseBorrowKnife);
        theBehaviorManager.addEventListener(PlayerBehavior.RECOVER_TOGETHER, this, this.handleResponseRecoverToghter);
        theBehaviorManager.addEventListener(PlayerBehavior.SUPER_CANCEL, this, this.handleResponseSuperCancel);
        theBehaviorManager.addEventListener(PlayerBehavior.GRAIN_GRIEVED, this, this.handleResponseGrainGrived);
        theBehaviorManager.addEventListener(PlayerBehavior.NO_HOMESICK, this, this.handleResponseNoHomesick);
        theBehaviorManager.addEventListener(PlayerBehavior.SUMMON_THUNDER, this, this.handleResponseSummonThunder);
        theBehaviorManager.addEventListener(PlayerBehavior.USE_EQUIP, this, this.handleResponseUseEquip);
        theBehaviorManager.addEventListener(PlayerBehavior.SINGLE_BEHAVIOR_FINISH, this, this.handleSingleBehaviorFinish);
    },

    handleResponseKill(this: GamePlayer, src: GamePlayer, generator: GeneratorBehavior, ...args) {
        if (this.robot && this.robot.enabled) {
            this.robot.handleResponseKill(src, generator, ...args);
            return;
        }
        theBehaviorManager.setResponse(true, generator);
    },

    handleResponseDodge(this: GamePlayer, src: GamePlayer, generator: GeneratorBehavior, ...args) {
        if (this.robot && this.robot.enabled) {
            this.robot.handleResponseDodge(src, generator, ...args);
            return;
        }
        theBehaviorManager.setResponse(true, generator);
    },

    handleResponseRecoverHp(this: GamePlayer, src: GamePlayer, generator: GeneratorBehavior, ...args) {
        if (this.robot && this.robot.enabled) {
            this.robot.handleResponseRecoverHp(src, generator, ...args);
            return;
        }
        theBehaviorManager.setResponse(true, generator);
    },

    handleResponseStrengthDamage(this: GamePlayer, src: GamePlayer, generator: GeneratorBehavior, ...args) {
        if (this.robot && this.robot.enabled) {
            this.robot.handleResponseStrengthDamage(src, generator, ...args);
            return;
        }
        theBehaviorManager.setResponse(true, generator);
    },

    handleResponseAttackWithFire(this: GamePlayer, src: GamePlayer, generator: GeneratorBehavior, ...args) {
        if (this.robot && this.robot.enabled) {
            this.robot.handleResponseAttackWithFire(src, generator, ...args);
            return;
        }
        theBehaviorManager.setResponse(true, generator);
    },

    handleResponseDuleWithOther(this: GamePlayer, src: GamePlayer, generator: GeneratorBehavior, ...args) {
        if (this.robot && this.robot.enabled) {
            this.robot.handleResponseDuleWithOther(src, generator, ...args);
            return;
        }
        theBehaviorManager.setResponse(true, generator);
    },

    handleResponseTearDownOther(this: GamePlayer, src: GamePlayer, generator: GeneratorBehavior, ...args) {
        if (this.robot && this.robot.enabled) {
            this.robot.handleResponseTearDownOther(src, generator, ...args);
            return;
        }
        theBehaviorManager.setResponse(true, generator);
    },

    handleResponseGrabFromOther(this: GamePlayer, src: GamePlayer, generator: GeneratorBehavior, ...args) {
        if (this.robot && this.robot.enabled) {
            this.robot.handleResponseGrabFromOther(src, generator, ...args);
            return;
        }
        theBehaviorManager.setResponse(true, generator);
    },

    handleResponseShareWithAll(this: GamePlayer, src: GamePlayer, generator: GeneratorBehavior, ...args) {
        if (this.robot && this.robot.enabled) {
            this.robot.handleResponseShareWithAll(src, generator, ...args);
            return;
        }
        theBehaviorManager.setResponse(true, generator);
    },

    handleResponseOutOfThinAir(this: GamePlayer, src: GamePlayer, generator: GeneratorBehavior, ...args) {
        if (this.robot && this.robot.enabled) {
            this.robot.handleResponseOutOfThinAir(src, generator, ...args);
            return;
        }
        theBehaviorManager.setResponse(true, generator);
    },

    handleResponseThousandArrowsShot(this: GamePlayer, src: GamePlayer, generator: GeneratorBehavior, ...args) {
        if (this.robot && this.robot.enabled) {
            this.robot.handleResponseThousandArrowsShot(src, generator, ...args);
            return;
        }
        theBehaviorManager.setResponse(true, generator);
    },

    handleResponseBarbarianBreakout(this: GamePlayer, src: GamePlayer, generator: GeneratorBehavior, ...args) {
        if (this.robot && this.robot.enabled) {
            this.robot.handleResponseBarbarianBreakout(src, generator, ...args);
            return;
        }
        theBehaviorManager.setResponse(true, generator);
    },

    handleResponseLockOtherByChain(this: GamePlayer, src: GamePlayer, generator: GeneratorBehavior, ...args) {
        if (this.robot && this.robot.enabled) {
            this.robot.handleResponseLockOtherByChain(src, generator, ...args);
            return;
        }
        theBehaviorManager.setResponse(true, generator);
    },

    handleResponseBorrowKnife(this: GamePlayer, src: GamePlayer, generator: GeneratorBehavior, ...args) {
        if (this.robot && this.robot.enabled) {
            this.robot.handleResponseBorrowKnife(src, generator, ...args);
            return;
        }
        theBehaviorManager.setResponse(true, generator);
    },

    handleResponseRecoverToghter(this: GamePlayer, src: GamePlayer, generator: GeneratorBehavior, ...args) {
        if (this.robot && this.robot.enabled) {
            this.robot.handleResponseRecoverToghter(src, generator, ...args);
            return;
        }
        theBehaviorManager.setResponse(true, generator);
    },

    handleResponseSuperCancel(this: GamePlayer, src: GamePlayer, generator: GeneratorBehavior, ...args) {
        if (this.robot && this.robot.enabled) {
            this.robot.handleResponseSuperCancel(src, generator, ...args);
            return;
        }
        theBehaviorManager.setResponse(true, generator);
    },

    handleResponseGrainGrived(this: GamePlayer, src: GamePlayer, generator: GeneratorBehavior, ...args) {
        if (this.robot && this.robot.enabled) {
            this.robot.handleResponseGrainGrived(src, generator, ...args);
            return;
        }
        theBehaviorManager.setResponse(true, generator);
    },

    handleResponseNoHomesick(this: GamePlayer, src: GamePlayer, generator: GeneratorBehavior, ...args) {
        if (this.robot && this.robot.enabled) {
            this.robot.handleResponseNoHomesick(src, generator, ...args);
            return;
        }
        theBehaviorManager.setResponse(true, generator);
    },

    handleResponseSummonThunder(this: GamePlayer, src: GamePlayer, generator: GeneratorBehavior, ...args) {
        if (this.robot && this.robot.enabled) {
            this.robot.handleResponseSummonThunder(src, generator, ...args);
            return;
        }
        theBehaviorManager.setResponse(true, generator);
    },

    handleResponseUseEquip(this: GamePlayer, src: GamePlayer, generator: GeneratorBehavior, ...args) {
        if (this.robot && this.robot.enabled) {
            this.robot.handleResponseUseEquip(src, generator, ...args);
            return;
        }
        theBehaviorManager.setResponse(true, generator);
    },

    handleSingleBehaviorFinish(this: GamePlayer, src: GamePlayer, generator: GeneratorBehavior, ...args) {
        if (this.robot && this.robot.enabled) {
            this.robot.handleSingleBehaviorFinish(src, generator, ...args);
            return;
        }
        theBehaviorManager.setResponse(true, generator);
    },
};
