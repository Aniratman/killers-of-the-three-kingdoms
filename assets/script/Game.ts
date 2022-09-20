import { _decorator, Component } from 'cc';
import { theConfigManager } from './ConfigManager';
import { theGameManager } from './GameManager';

const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {
    start() {
        this.scheduleOnce(() => {
            theConfigManager.init().then(() => {
                theGameManager.initGame();
                theGameManager.startGame();
            });
        }, 0.1);
    }
}
