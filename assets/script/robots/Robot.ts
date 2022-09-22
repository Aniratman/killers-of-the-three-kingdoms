import { theGameManager } from '../controler/GameManager';
import GamePlayer from '../game/GamePlayer';

export default abstract class Robot {
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

    handleGameStart(player: GamePlayer) {
        theGameManager.isResponse = true;
    }

    handleRoundBegin(player: GamePlayer) {
        theGameManager.isResponse = true;
    }

    handlePersonalPrepare(player: GamePlayer) {
        theGameManager.isResponse = true;
    }

    handlePersonalJudge(player: GamePlayer) {
        theGameManager.isResponse = true;
    }

    handlePersonalDealCard(player: GamePlayer) {
        theGameManager.isResponse = true;
    }

    handlePersonalPlayCard(player: GamePlayer) {
        theGameManager.isResponse = true;
    }

    handlePersonalGarbageCard(player: GamePlayer) {
        theGameManager.isResponse = true;
    }

    handlePersonalFinish(player: GamePlayer) {
        theGameManager.isResponse = true;
    }

    handleRoundFinish(player: GamePlayer) {
        theGameManager.isResponse = true;
    }

    handleGameEnd(player: GamePlayer) {
        theGameManager.isResponse = true;
    }
}
