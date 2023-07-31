import { Injectable } from '@angular/core';
import { ApiService } from '.';
import { Observable, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor(private api: ApiService) {}

  loadTeams(homeTeamLocation: string, awayTeamLocation: string): Observable<any> {
    return forkJoin([
      this.api.getPlayers(homeTeamLocation),
      this.api.getPlayers(awayTeamLocation),
    ])
  }
}
