import { director, ISchedulable } from 'cc';
import GeneratorStack, { GeneratorNextData } from '../common/GeneratorStack';
import GamePlayer from '../game/GamePlayer';
import BehaviorEvent, { PlayerBehavior } from './BehaviorEvent';
import { theGameManager } from './GameManager';

export type GeneratorBehavior = Generator<boolean, PlayerBehavior, GeneratorNextData<unknown>>;

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

    public isScheduler: boolean = false;

    getResponse() {
        return this.__generatorStack && this.__generatorStack.getResponse();
    }
    setResponse(response: boolean, generator?: GeneratorBehavior) {
        if (this.__generatorStack) {
            this.__generatorStack.setResponse(response, generator);
        }
    }

    private __generatorStack: GeneratorStack<boolean, PlayerBehavior, GeneratorNextData<unknown>> = null;

    private constructor() {
        super();
        this.__generatorStack = new GeneratorStack();
    }

    private scheduleUpdate() {
        if (this.__generatorStack && this.__generatorStack.isComplete()) {
            this.stopBehaviorScheduler();
            // todo: 一波事件结算完成，通知当前玩家继续操作
            this.triggerEventWithGenerator(PlayerBehavior.SINGLE_BEHAVIOR_FINISH, theGameManager.currentPlayer, [theGameManager.currentPlayer]);
            return;
        }

        if (this.__generatorStack && this.getResponse()) {
            this.setResponse(false);
            const iterResult = this.__generatorStack.next({});

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
            const generator = this.__generatorStack.top();
            const nextParam: GeneratorNextData<unknown> = yield this.triggerEventListener(behavior, player, src, generator, ...args);
            if (nextParam && nextParam.isOver) {
                break;
            }
        }
        return behavior;
    }

    startBehaviorScheduler() {
        this.isScheduler = true;
        director.getScheduler().schedule(this.scheduleUpdate, this, 0.1);
    }

    stopBehaviorScheduler() {
        this.isScheduler = false;
        director.getScheduler().unschedule(this.scheduleUpdate, this);
    }

    triggerEventWithGenerator(behavior: PlayerBehavior, src: GamePlayer, dst: GamePlayer[], ...args) {
        const generator = this.createBehaviorEventTriggerGenerator(behavior, src, dst, ...args);
        this.__generatorStack.push(generator);
        if (!this.isScheduler) {
            this.startBehaviorScheduler();
        }
        this.__generatorStack.next();
    }
}

export const theBehaviorManager = BehaviorManager.instance;
