import { IResult } from "../interfaces";

export class Result implements IResult {
  goalsHomeTeam: number = 0;
  goalsAwayTeam: number = 0;
  redCardsHomeTeam: number = 0;
  redCardsAwayTeam: number = 0;

  constructor(result: IResult | null | undefined) { 
    this.goalsHomeTeam = result?.goalsHomeTeam || 0;
    this.goalsAwayTeam = result?.goalsAwayTeam || 0;
    this.redCardsHomeTeam = result?.redCardsHomeTeam || 0;
    this.redCardsAwayTeam = result?.redCardsAwayTeam || 0;
  }

  addGoal(team: string): void {
    if (team === 'away')
        this.goalsAwayTeam++;
    else
        this.goalsHomeTeam++;
  }

  addSuspension(team: string): void {
      if (team === 'away')
          this.redCardsAwayTeam++;
      else
          this.redCardsHomeTeam++;
  }
}