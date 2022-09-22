import { director, ISchedulable } from 'cc';
import GeneratorStack, { GeneratorNextData } from '../common/GeneratorStack';
import GamePlayer from '../game/GamePlayer';
import BehaviorEvent, { PlayerBehavior } from './BehaviorEvent';

export default class BehaviorManager extends BehaviorEvent implements ISchedulable {
    private static __instance: BehaviorManager = null;
    static get instance() {
        if (!this.__instance) {
            this.__instance = new BehaviorManager();
        }
        return this.__instance;
    }

    public id?: string = 'BehaviorManager';
    public uuid?: string = `BM_${Date.now()}`;

    public isResponse: boolean = false;

    private __generatorStack: GeneratorStack<boolean, PlayerBehavior, GeneratorNextData<unknown>> = null;

    private constructor() {
        super();
        this.__generatorStack = new GeneratorStack();
    }

    private scheduleUpdate() {
        if (this.__generatorStack && this.isResponse) {
            this.isResponse = false;
            const iterResult = this.__generatorStack.next({});
            if (iterResult.done && this.__generatorStack.isComplete()) {
                this.stopBehaviorScheduler();
                return;
            }
            if (iterResult.done) {
                this.__generatorStack.next();
            } else if (!iterResult.value) {
                console.error('当前阶段回调失败');
            }
        }
    }

    *createBehaviorEventTriggerGenerator(behavior: PlayerBehavior, src: GamePlayer, dst: GamePlayer[], ...args) {
        for (const player of dst) {
            if (!player.isValid) {
                continue;
            }
            const nextParam: GeneratorNextData<unknown> = yield this.triggerEventListener(behavior, player, src, ...args);
            if (nextParam && nextParam.isOver) {
                break;
            }
        }
        return behavior;
    }

    startBehaviorScheduler() {
        director.getScheduler().schedule(this.scheduleUpdate, this, 0.1);
    }

    stopBehaviorScheduler() {
        director.getScheduler().unschedule(this.scheduleUpdate, this);
    }
}

export const theBehaviorManager = BehaviorManager.instance;
