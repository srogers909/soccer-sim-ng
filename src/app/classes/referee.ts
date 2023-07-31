import { IReferee } from "../interfaces";

export class Referee implements IReferee {
  name: string = '';
  nationality: string = '';
  personality: number = 0;

  constructor(referee: IReferee) {
    this.name = referee.name;
    this.nationality = referee.nationality;
    this.personality = referee.personality;
  }
}