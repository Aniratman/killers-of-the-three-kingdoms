import { Identity } from '../common/CommonStructs';
import { theGameManager } from '../controler/GameManager';
import GamePlayer from '../game/GamePlayer';
import Robot from './Robot';

export default class RobotMinister extends Robot {
    queryTeammates() {
        let teammates: GamePlayer[] = [];

        teammates = teammates.concat(theGameManager.queryPlayersByIdentity(Identity.Emperor));

        if (theGameManager.identitySets[Identity.Minister] > 0) {
            teammates = teammates.concat(theGameManager.queryPlayersByIdentity(Identity.Minister));
        }
        teammates = teammates.filter((player) => player !== this.__player);

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
