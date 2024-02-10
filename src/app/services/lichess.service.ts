import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import sleep from 'sleep-promise';
import { environment } from 'src/environments/environment';

const BASE_URL = 'https://lichess.org';

interface IImportResult {
  id: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class LichessService {

  constructor(private http: HttpClient) { }

  async importGame(pgn: string): Promise<string> {
    if (false && !environment.production) {
      return this.fakeImportGame();
    }
    const body = new HttpParams().set('pgn', pgn);
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const res = await this.http.post<IImportResult>(this.getUrl('/api/import'), body, {headers}).toPromise();
    return res.url;
  }

  private async fakeImportGame() {
    await sleep(1000);
    return 'https://lichess.org/EUgjbNlf';
  }

  private getUrl(url: string) {
    return `${BASE_URL}${url}`;
  }
}
