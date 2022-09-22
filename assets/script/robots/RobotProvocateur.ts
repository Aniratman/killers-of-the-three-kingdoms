import { Identity } from '../common/CommonStructs';
import { theGameManager } from '../controler/GameManager';
import GamePlayer from '../game/GamePlayer';
import Robot from './Robot';

export default class RobotProvocateur extends Robot {
    queryTeammates() {
        let teammates: GamePlayer[] = [];

        if (theGameManager.identitySets[Identity.Minister] + theGameManager.identitySets[Identity.Provocateur] < theGameManager.identitySets[Identity.Rebel]) {
            teammates = theGameManager.queryPlayersByIdentity(Identity.Emperor);
        } else {
            teammates = theGameManager.queryPlayersByIdentity(Identity.Rebel);
        }

        return teammates;
    }

    queryEnemies() {
        let enemies: GamePlayer[] = [];

        if (theGameManager.identitySets[Identity.Rebel] > 0) {
            enemies = enemies.concat(theGameManager.queryPlayersByIdentity(Identity.Rebel));
        }

        if (theGameManager.identitySets[Identity.Rebel] < theGameManager.identities[Identity.Minister] + theGameManager.identities[Identity.Emperor]) {
            if (theGameManager.identitySets[Identity.Minister] > 0) {
                enemies = enemies.concat(theGameManager.queryPlayersByIdentity(Identity.Minister));
            }
        }

        if (theGameManager.identities[Identity.Minister] + theGameManager.identities[Identity.Rebel] === 0) {
            enemies = enemies.concat(theGameManager.queryPlayersByIdentity(Identity.Emperor));
        }

        return enemies;
    }
}
