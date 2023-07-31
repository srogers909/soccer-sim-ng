import moment, { Moment } from "moment";
import { IPlayer } from "../interfaces";

export class Player {
  name: string = '';
  position: string = '';
  statAtt: number = 0;
  statDef: number = 0;
  statMed: number = 0;
  status: string = '';
  nationality: string = '';
  birthDate: Moment = moment();
  fullName: string = '';

  constructor(player: IPlayer) {
    this.name = player.name;
    this.position = player.position;
    this.statAtt = player.statAtt;
    this.statDef = player.statDef;
    this.statMed = (player.statAtt + player.statDef) / 2;
    this.status = player.status;
    this.nationality = player.nationality;
    this.birthDate = player.birthDate;
    this.fullName = player.fullName;
  }

  getAge(): number {
    return moment().diff(this.birthDate, 'year');
  }
}