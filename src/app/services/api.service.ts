import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Player } from '../classes';
import { IPlayer } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  getPlayers(fileLocation: string): Observable<Array<Player>> {
    return this.http.get(fileLocation)
      .pipe(
        map((players: any) => {
          return players.map((player: any) => {
            return new Player({
              name: player.Name,
              position: player.Position,
              statAtt: player.StatAtt,
              statDef: player.StatDef,
              statMed: player.StatMed,
              status: player.TeamNr,
              nationality: player.Nationality,
              birthDate: player.BirthDate,
              fullName: player.FullName
            } as IPlayer);
          });
        })
      );
  }
}


