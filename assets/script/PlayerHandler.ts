import { GameStage } from './GameEvent';
import { theGameManager } from './GameManager';
import GamePlayer from './GamePlayer';

export default class PlayerHandler {
    private __player: GamePlayer = null;

    constructor(player: GamePlayer) {
        this.__player = player;
    }

    registerEvents() {
        theGameManager.addEventListener(GameStage.GAME_START, this.__player, this.handleGameStart);
        theGameManager.addEventListener(GameStage.GAME_ALL_BEGIN, this.__player, this.handleAllBegin);
        theGameManager.addEventListener(GameStage.GAME_SINGLE_PREPARE, this.__player, this.handleSinglePrepare);
        theGameManager.addEventListener(GameStage.GAME_SINGLE_JUDGE, this.__player, this.handleSingleJudge);
        theGameManager.addEventListener(GameStage.GAME_SINGLE_DEAL_CARD, this.__player, this.handleSingleDealCard);
        theGameManager.addEventListener(GameStage.GAME_SINGLE_SEND_CARD, this.__player, this.handleSingleSendCard);
        theGameManager.addEventListener(GameStage.GAME_SINGLE_GARBAGE_CARD, this.__player, this.handleSingleGarbageCard);
        theGameManager.addEventListener(GameStage.GAME_SINGLE_FINISH, this.__player, this.handleSingleFinish);
        theGameManager.addEventListener(GameStage.GAME_ALL_FINISH, this.__player, this.handleAllFinish);
        theGameManager.addEventListener(GameStage.GAME_END, this.__player, this.handleGameEnd);
    }

    handleGameStart() {}

    handleAllBegin() {}

    handleSinglePrepare() {}

    handleSingleJudge() {}

    handleSingleDealCard() {}

    handleSingleSendCard() {}

    handleSingleGarbageCard() {}

    handleSingleFinish() {}

    handleAllFinish() {}

    handleGameEnd() {}
}
