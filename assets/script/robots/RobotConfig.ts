import { ClassConstructor, Identity } from '../common/CommonStructs';
import Robot from './Robot';
import RobotLord from './RobotEmperor';
import RobotLoyola from './RobotMinister';
import RobotRebel from './RobotRebel';
import RobotTraitor from './RobotProvocateur';

export const RobotConfig: { [index: number]: ClassConstructor<Robot> } = {
    [Identity.Emperor]: RobotLord,
    [Identity.Minister]: RobotLoyola,
    [Identity.Rebel]: RobotRebel,
    [Identity.Provocateur]: RobotTraitor,
};
