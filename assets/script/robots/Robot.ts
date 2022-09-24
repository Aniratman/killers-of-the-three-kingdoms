import { Utility } from '../common/Utility';
import { checkBehaviorValid } from '../controler/BehaviorEvent';
import { GeneratorBehavior, theBehaviorManager } from '../controler/BehaviorManager';
import { GameStage } from '../controler/GameEvent';
import { theGameManager } from '../controler/GameManager';
import { BehaviorListener, StageListener } from '../game/GameInterface';
import GamePlayer from '../game/GamePlayer';
import PlayCard from '../game/PlayCard';
import { convertListToSet, LOSE_CARD_PRIORITY, PLAY_CARD_PRIORITY } from './RobotConfig';

export default abstract class Robot implements Partial<StageListener>, Partial<BehaviorListener> {
    isPlayCard: boolean = false;

    private __enabled: boolean = false;
    get enabled() {
        return this.__enabled;
    }
    set enabled(enabled: boolean) {
        this.__enabled = enabled;
    }

    protected __player: GamePlayer = null;

    constructor(player: GamePlayer) {
        this.__player = player;
    }

    abstract queryTeammates(): GamePlayer[];

    abstract queryEnemies(): GamePlayer[];

    canPlayCard() {
        if (this.isPlayCard) {
            return false;
        }
        if (this.__player.handCards.length <= 0) {
            return false;
        }
        const enemies = this.queryEnemies();
        if (enemies.length <= 0) {
            return false;
        }
        for (const enemy of enemies) {
            for (const card of this.__player.handCards) {
                if (checkBehaviorValid(card.behavior, this.__player, [enemy])) {
                    return true;
                }
            }
        }
        return false;
    }

    queryExecuteableBehavior(): [PlayCard, GamePlayer] {
        const enemies = this.queryEnemies();
        for (let i = 0; i < PLAY_CARD_PRIORITY.length; ++i) {
            const index = Utility.indexOf(this.__player.handCards, (card) => card.behavior === PLAY_CARD_PRIORITY[i]);
            if (index < 0) {
                continue;
            }
            for (const enemy of enemies) {
                if (checkBehaviorValid(PLAY_CARD_PRIORITY[i], this.__player, [enemy])) {
                    return [this.__player.handCards[index], enemy];
                }
            }
        }
        return [null, null];
    }

    handleGameStart(player: GamePlayer) {
        theGameManager.setResponse(true);
    }

    handleRoundBegin(player: GamePlayer) {
        theGameManager.setResponse(true);
    }

    handlePersonalPrepare(player: GamePlayer) {
        theGameManager.setResponse(true);
    }

    handlePersonalJudge(player: GamePlayer) {
        theGameManager.setResponse(true);
    }

    handlePersonalDealCard(player: GamePlayer) {
        if (player !== this.__player) {
            theGameManager.setResponse(true);
            return;
        }
        const cards = theGameManager.dealCards(this.__player.gainCardNum);
        this.__player.gainCards(cards);
        theGameManager.setResponse(true);
    }

    handlePersonalPlayCard(player: GamePlayer) {
        if (player !== this.__player) {
            theGameManager.setResponse(true);
            return;
        }
        if (!this.canPlayCard()) {
            theGameManager.setResponse(true);
        } else {
            const [card, enemy] = this.queryExecuteableBehavior();
            theBehaviorManager.triggerEventWithGenerator(card.behavior, this.__player, [enemy]);
            this.isPlayCard = true;
        }
    }

    handlePersonalLoseCard(player: GamePlayer) {
        if (player === this.__player) {
            if (this.__player.handCards.length > this.__player.curHp) {
                const priority = convertListToSet(LOSE_CARD_PRIORITY);
                this.__player.handCards.sort((a, b) => priority[b.behavior] - priority[a.behavior]);
                const cards = Utility.slice(this.__player.handCards, this.__player.curHp);
                this.__player.loseCards(cards);
            }
        }
        theGameManager.setResponse(true);
    }

    handlePersonalFinish(player: GamePlayer) {
        if (player === this.__player) {
            this.isPlayCard = false;
        }
        theGameManager.setResponse(true);
    }

    handleRoundFinish(player: GamePlayer) {
        theGameManager.setResponse(true);
    }

    handleGameEnd(player: GamePlayer) {
        theGameManager.setResponse(true);
    }

    /*
     ************分****界****线************
     */

    handleResponseKill(src: GamePlayer, generator: GeneratorBehavior, ...args) {
        console.log('response');

        theBehaviorManager.setResponse(true, generator);
    }

    handleResponseDodge(src: GamePlayer, generator: GeneratorBehavior, ...args) {
        console.log('response');

        theBehaviorManager.setResponse(true, generator);
    }

    handleResponseRecoverHp(src: GamePlayer, generator: GeneratorBehavior, ...args) {
        console.log('response');

        theBehaviorManager.setResponse(true, generator);
    }

    handleResponseStrengthDamage(src: GamePlayer, generator: GeneratorBehavior, ...args) {
        console.log('response');

        theBehaviorManager.setResponse(true, generator);
    }

    handleResponseAttackWithFire(src: GamePlayer, generator: GeneratorBehavior, ...args) {
        console.log('response');

        theBehaviorManager.setResponse(true, generator);
    }

    handleResponseDuleWithOther(src: GamePlayer, generator: GeneratorBehavior, ...args) {
        console.log('response');

        theBehaviorManager.setResponse(true, generator);
    }

    handleResponseTearDownOther(src: GamePlayer, generator: GeneratorBehavior, ...args) {
        console.log('response');

        theBehaviorManager.setResponse(true, generator);
    }

    handleResponseGrabFromOther(src: GamePlayer, generator: GeneratorBehavior, ...args) {
        console.log('response');

        theBehaviorManager.setResponse(true, generator);
    }

    handleResponseShareWithAll(src: GamePlayer, generator: GeneratorBehavior, ...args) {
        console.log('response');

        theBehaviorManager.setResponse(true, generator);
    }

    handleResponseOutOfThinAir(src: GamePlayer, generator: GeneratorBehavior, ...args) {
        console.log('response');

        theBehaviorManager.setResponse(true, generator);
    }

    handleResponseThousandArrowsShot(src: GamePlayer, generator: GeneratorBehavior, ...args) {
        console.log('response');

        theBehaviorManager.setResponse(true, generator);
    }

    handleResponseBarbarianBreakout(src: GamePlayer, generator: GeneratorBehavior, ...args) {
        console.log('response');

        theBehaviorManager.setResponse(true, generator);
    }

    handleResponseLockOtherByChain(src: GamePlayer, generator: GeneratorBehavior, ...args) {
        console.log('response');

        theBehaviorManager.setResponse(true, generator);
    }

    handleResponseBorrowKnife(src: GamePlayer, generator: GeneratorBehavior, ...args) {
        console.log('response');

        theBehaviorManager.setResponse(true, generator);
    }

    handleResponseRecoverToghter(src: GamePlayer, generator: GeneratorBehavior, ...args) {
        console.log('response');

        theBehaviorManager.setResponse(true, generator);
    }

    handleResponseSuperCancel(src: GamePlayer, generator: GeneratorBehavior, ...args) {
        console.log('response');

        theBehaviorManager.setResponse(true, generator);
    }

    handleResponseGrainGrived(src: GamePlayer, generator: GeneratorBehavior, ...args) {
        console.log('response');

        theBehaviorManager.setResponse(true, generator);
    }

    handleResponseNoHomesick(src: GamePlayer, generator: GeneratorBehavior, ...args) {
        console.log('response');

        theBehaviorManager.setResponse(true, generator);
    }

    handleResponseSummonThunder(src: GamePlayer, generator: GeneratorBehavior, ...args) {
        console.log('response');

        theBehaviorManager.setResponse(true, generator);
    }

    handleResponseUseEquip(src: GamePlayer, generator: GeneratorBehavior, ...args) {
        console.log('response');

        theBehaviorManager.setResponse(true, generator);
    }

    handleSingleBehaviorFinish(src: GamePlayer, generator: GeneratorBehavior, ...args) {
        if (theGameManager.gameStage === GameStage.GAME_PERSONAL_PLAY_CARD) {
            this.handlePersonalPlayCard(this.__player);
        }
        theBehaviorManager.setResponse(true, generator);
    }
}
