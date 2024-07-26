import { _decorator, Component } from 'cc';
import { theConfigManager } from './controler/ConfigManager';
import { theGameManager } from './controler/GameManager';

const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {
    start() {
        this.scheduleOnce(() => {
            theConfigManager.init().then(() => {
                theGameManager.playerNum = 5;
                theGameManager.initGame();
                theGameManager.startGame();
            });
        }, 0.1);
    }
}
