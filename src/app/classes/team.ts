import { Player } from ".";
import { IPlayer, ITeam } from "../interfaces";
import { AppSettings } from "../utilities";


export class Team implements ITeam {
  name: string = '';
  players: Array<Player> = [];
  startingEleven: Array<Player> = [];
  form: number = 0;
  supporters: number = 0;
  playingStyle: number = 0;

  constructor(team: ITeam) {
    this.name = team.name;
    this.players = team.players;
    this.startingEleven = team.startingEleven;
    this.form = team.form;
    this.supporters = team.supporters;
    this.playingStyle = team.playingStyle;
  }

  buildTeam(list: Array<Player>): void {
    for (let player of list) {
      if (player.status === "T") {
        this.addTitularPlayer(player);
      } else {
        this.addPlayer(player);
      }
    }

    console.log(this.startingEleven);
    console.log(this.players);
  }

  addTitularPlayer(player: Player): void {
    this.startingEleven.push(player);
  }

  addPlayer(player: Player): void {
    this.players.push(player);
  }

  getMeanAge(): number {
    let sum: number = 0;
    let mean: number = 0;

    for (let player of this.players) {
      sum += player.getAge();
    }

    mean = sum / this.players.length;

    return mean;
  }

  getAttack(): number {
    let sumAttack: number = 0;
    let count: number = 0;

    for (let player of this.startingEleven) {
      if (player.position === "A") {
        sumAttack += player.statAtt;
        count++;
      }
    }

    return sumAttack / count;
  }

  getMeanAttackingValue(): number {
    let sumAtt: number = 0;

    for (let player of this.startingEleven) {
      sumAtt += player.statAtt;
    }

    return sumAtt / 11;
  }

  getDefense(): number {
    let sumDefense: number = 0;
    let count: number = 0;

    for (let player of this.startingEleven) {
      if (player.position === "D" || player.position === "G") {
        sumDefense += player.statDef;
        count++;
      }
    }

    return sumDefense / count;
  }

  getMeanValue(): number {
    let sum: number = 0;

    for (let player of this.startingEleven) {
      sum += player.statMed;
    }

    return sum / 11;
  }

  calculateAttack(minute: number, redCards: number): number {
    let att: number = 0;

    //Value of Attack
    att += (this.getAttack() * 0.75) + (this.getMeanValue() * 0.25);

    //Time Effect on Age
    att -= this.ageEffect(minute);

    //Time Effect on Suspensions
    att -= this.redCardsEffect(redCards);

    //Supporters Rate Effect
    att += this.formEffect();

    //Form Rate Effect - High Form increases chances of goal
    //If form good it increases chances of scoring/starting attack
    if (this.form > AppSettings.MINIMAL_FORM) {
      att += this.formEffect();
    } else {
      att -= this.formEffect();
    }

    //Playing Style Effect
    // 0: Super Defensive
    // 100: Super Attacking
    att += this.playingStyleEffect();

    return att;
  }

  calculateGoal(minute: number, redCards: number): number {
    let goal = 0;

    //Value of Scoring
    goal += (this.getAttack() * 0.75) + (this.getMeanAttackingValue() * 0.25);

    //Time Effect on Age with time
    goal -= this.ageEffect(minute);

    //Time Effect on Suspensions
    goal -= this.redCardsEffect(redCards);

    //Form Rate Effect - High Form increases chances of goal
    //If form good it increases chances of scoring/starting attack
    if(this.form > AppSettings.MINIMAL_FORM)
        goal += this.formEffect();
    else
        goal -= this.formEffect();

    return goal;
  }

  calculateDefend(minute: number, redCards: number): number {
    let defense = 0;

    //Value of defense
    defense += (this.getDefense() * 0.75) + (this.getMeanValue() * 0.25);

    //Time Effect on Age with time
    defense -= this.ageEffect(minute);

    //Time Effect on Suspensions
    defense -= this.redCardsEffect(redCards);

    //Supporters Rate Effect
    defense += this.supportersEffect();

    //Form Rate Effect
    defense += this.formEffect();

    //Playing Style Effect
    // 0: Super Defensive
    // 100: Super Attacking
    // More attack less defense
    defense += this.playingStyleEffect();

    return defense;
  }

  private redCardsEffect(redCards: number): number {
    return redCards * AppSettings.RED_CARD_EFFECT;
  }

  private formEffect(): number {
    return this.form * AppSettings.FORM_EFFECT;
  }

  private playingStyleEffect(): number {
    return  (
            - this.playingStyle * AppSettings.PLAYING_STYLE_EFFECT //Attack
    + (100 - this.playingStyle * AppSettings.PLAYING_STYLE_EFFECT)); //Defence

  }

  private supportersEffect(): number {
    let rivalsSupporters: number = 100 - this.supporters;
    return (this.supporters - rivalsSupporters) * AppSettings.SUPPORTERS_EFFECT;
  }

  private ageEffect(minute: number): number {
    return (this.getMeanAge() * AppSettings.AGE_EFFECT) * (minute * AppSettings.TIME_EFFECT);
  }  
}