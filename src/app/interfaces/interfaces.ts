import { Moment } from "moment";
import { Player, Referee, Result, Team } from "../classes";

export interface IPlayer { 
  name: string;
  position: string;
  statAtt: number;
  statDef: number;
  statMed: number;
  status: string;
  nationality: string;
  birthDate: Moment;
  fullName: string;
}

export interface ITeam {
  name: string;
  players: Array<Player>;
  startingEleven: Array<Player>;
  form: number;
  supporters: number;
  playingStyle: number;
}

export interface IReferee {
  name: string;
  nationality: string;
  personality: number;
}

export interface IResult {
  goalsHomeTeam: number;
  goalsAwayTeam: number;
  redCardsHomeTeam: number;
  redCardsAwayTeam: number;
}

export interface IGame {
  homeTeam: Team;
  awayTeam: Team;
  referee: Referee;
  finalResult: Result;
}