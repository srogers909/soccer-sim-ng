import { Component, OnInit } from '@angular/core';
import { LoaderService } from './services';
import { take } from 'rxjs';
import { Game, Referee, Result, Team } from './classes';
import { IGame, IReferee, IResult, ITeam } from './interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'soccer-sim-ng';

  constructor(private loader: LoaderService){ }

  ngOnInit(): void {
    let homeTeam = new Team({
      name: 'England',
      players: [],
      startingEleven: [],
      form: 0,
      supporters: 0,
      playingStyle: 0
    } as ITeam);
    
    let awayTeam = new Team({
      name: 'Netherlands',
      players: [],
      startingEleven: [],
      form: 0,
      supporters: 0,
      playingStyle: 0
    } as ITeam);

    this.loader.loadTeams(
      'assets/england.json',
      'assets/netherlands.json'
    )
    .pipe(take(1))
    .subscribe({
      next: (data) => {
        console.log(data);

        homeTeam.buildTeam(data[0]);
        awayTeam.buildTeam(data[1]);

        console.log(homeTeam);
        console.log(awayTeam);

        let gameRef = new Referee({
          name: 'Example Ref',
          nationality: 'England',
          personality: 0
        } as IReferee);

        let result = new Result({ 
          goalsHomeTeam: 0,
          goalsAwayTeam: 0,
          redCardsHomeTeam: 0,
          redCardsAwayTeam: 0
        } as IResult);

        let currentGame = new Game({
          homeTeam: homeTeam,
          awayTeam: awayTeam,
          referee: gameRef,
          finalResult: result
        } as IGame);

        let finalResult = currentGame.startSimulation();

        console.log(finalResult);
      },
      error: (error) => {
        console.log(error);
      }
    }); 
  }  
}

