import { Injectable } from '@angular/core';
import { HEROES } from './mock-heroes';
import { Hero } from './hero';
import { Observable, of } from 'rxjs';
import { MessagesService } from './messages.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = 'api/heroes';
  constructor(private http: HttpClient,
    private messagesService: MessagesService) { }
    private httpHeaders = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application-type'
      })
    }
  getHeroes(): Observable<Hero[]> {
    this.messagesService.add('HeroService: fetchedHeroes');
    // return of(HEROES); // mock data returned
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      catchError(this.handleError('get Heroes', []))
    );
  }

  /**
    * Handle Http operation that failed.
    * Let the app continue.
    * @param operation - name of the operation that failed
    * @param result - optional value to return as the observable result
  */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any ): Observable<T> => {
      this.log(`${operation} failed: ${error.message}`);
      return of (result as T);
    }
  }
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpHeaders).pipe(
      tap((hero: Hero)=> this.log(`added hero w/ id=${hero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    )
  }
  deleteHero(hero: Hero | number ): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpHeaders).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  getHero(id: number): Observable<Hero> {
    // this.messagesService.add(`HeroService: fetched hero id=${id}`);
    // return of(HEROES.find(hero => hero.id === id))
    let url = '${this.heroesUrl}/${id}';
    return this.http.get<Hero>(url).pipe(
      tap(_=> this.log(`fetch hero ${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    )
  }
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpHeaders).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>(`Put operation failed ${hero.id}`))
    );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }

    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('search failed'))
    );
  }

  private log(message: string) {
    this.messagesService.add(`HeroService: ${message}`);
  }
}
