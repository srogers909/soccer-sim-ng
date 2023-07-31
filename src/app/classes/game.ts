import { IGame } from "../interfaces";
import { Referee, Result, Team } from "./../classes";
import { AppSettings } from "../utilities";

export class Game implements IGame {
  homeTeam: Team;
  awayTeam: Team;
  referee: Referee;
  finalResult: Result;

  constructor(game: IGame) {
    this.homeTeam = game.homeTeam;
    this.awayTeam = game.awayTeam;
    this.referee = game.referee;
    this.finalResult = game.finalResult;
  }

  // Calculate what team starts an attack
  private startsAttack(minute: number): Team | null {
    // Value of attack of each team
    let homeTeamStartAttack: number =
            this.homeTeam.calculateAttack(minute, this.finalResult.redCardsHomeTeam);
    let awayTeamStartAttack: number =
            this.awayTeam.calculateAttack(minute, this.finalResult.redCardsAwayTeam);

    // Random Factoring
    let probHome: number = homeTeamStartAttack / (Math.random() * 100);
    let probAway: number = awayTeamStartAttack / (Math.random() * 100);

    if ((probHome > probAway) && probHome > AppSettings.SCORE_FACTOR) {
        return this.homeTeam;
    }
    if ((probAway > probHome) && probAway > AppSettings.SCORE_FACTOR) {
        return  this.awayTeam;
    } else 
      return null;
  }


  // Calculate if defending team is able to stop goal
  private defendAttack(att: Team, def: Team, minute: number): boolean {
    let attSuspensions: number, defSuspensions: number;

    if(att === this.awayTeam) {
      attSuspensions = this.finalResult.redCardsAwayTeam;
      defSuspensions = this.finalResult.redCardsHomeTeam;
    }
    else {
      attSuspensions = this.finalResult.redCardsHomeTeam;
      defSuspensions = this.finalResult.redCardsAwayTeam;
    }

    // Value of team defending attack
    let defendAttack: number = def.calculateDefend(minute, defSuspensions);

    // Value of team scoring goal
    let score: number = att.calculateGoal(minute, attSuspensions);

    // Random factoring and Luck factor
    let scoreProb: number = score / (Math.random() * 100);
    let defendProb: number = defendAttack / (Math.random() * 100) + Math.random();

    return !(scoreProb > defendProb) || !(scoreProb > AppSettings.SCORE_FACTOR);
  }


  faultEvent(minute: number): void {
    let redCard: number = this.referee.personality *
            Math.random() * AppSettings.REFEREE_PERSONALITY_FACTOR;

    // If is likely to send off
    if (redCard > AppSettings.REFEREE_RED_CARD) {
      // Randomly Pick Team
      if(Math.random() > 0.5){
        this.finalResult.addSuspension("home");
        console.log(minute, " [RED CARD] ", this.homeTeam.name);
      }

      else {
        this.finalResult.addSuspension("away");
        console.log(minute, " [RED CARD] ", this.awayTeam.name);
      }
    }
  }


  attackEvent(minute: number): void {
    //Get team that starts an attack
    let attack: Team | null = this.startsAttack(minute);
    let def: Team;

    if (attack?.name === this.awayTeam.name) 
      def = this.homeTeam;
    else 
      def = this.awayTeam;

    //If there will start an attack
    if (attack != null) {
      if (!this.defendAttack(attack, def, minute)) {

        console.log(minute, ' [GOAL] ', attack.name);

        //Add goal to result
        if (attack == this.awayTeam)
            this.finalResult.addGoal("away");
        else
            this.finalResult.addGoal("home");
      }
      else
        console.log(minute, ' [FAILED] ', attack.name);
    }
  }


  private printStarting11(team: Team): void {
    console.log('[', team.name, ']');

    for(let pl of team.startingEleven){
      console.log(pl.position, ': ', pl.name);
    }

    console.log('########\n');
  }

  // Game Simulation
  startSimulation(): Result {
    //Starting 11
    this.printStarting11(this.homeTeam);
    this.printStarting11(this.awayTeam);

    console.log('[GAME STARTED]');

    //90 minutes Game
    for (let minute = 0; minute < 90; minute++) {
      //What happens in this minute?
      let action: number = Math.random();

      // Fault
      if (action < AppSettings.FAULT_FACTOR) {
        this.faultEvent(minute);
      }

      // Attack
      if (action > AppSettings.ATTACK_FACTOR) {
        this.attackEvent(minute);
      }

      // Otherwise nothing happens
      if (minute == 45)
        console.log('[BREAK]');
    }

    return this.finalResult;
  }
}