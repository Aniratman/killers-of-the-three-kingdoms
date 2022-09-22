import { Identity } from '../common/CommonStructs';
import { theGameManager } from '../controler/GameManager';
import GamePlayer from '../game/GamePlayer';
import Robot from './Robot';

export default class RobotEmperor extends Robot {
    queryTeammates() {
        let teammates: GamePlayer[] = [];

        if (theGameManager.identitySets[Identity.Minister] > 0) {
            teammates = teammates.concat(theGameManager.queryPlayersByIdentity(Identity.Minister));
        }

        if (theGameManager.identitySets[Identity.Rebel] > theGameManager.identities[Identity.Minister]) {
            if (theGameManager.identitySets[Identity.Provocateur] > 0) {
                teammates = teammates.concat(theGameManager.queryPlayersByIdentity(Identity.Provocateur));
            }
        }
        return teammates;
    }

    queryEnemies() {
        let enemies: GamePlayer[] = [];

        if (theGameManager.identitySets[Identity.Rebel] > 0) {
            enemies = theGameManager.queryPlayersByIdentity(Identity.Rebel);
        }

        if (theGameManager.identitySets[Identity.Rebel] < theGameManager.identities[Identity.Minister]) {
            if (theGameManager.identitySets[Identity.Provocateur] > 0) {
                enemies = enemies.concat(theGameManager.queryPlayersByIdentity(Identity.Provocateur));
            }
        }

        return enemies;
    }
}
