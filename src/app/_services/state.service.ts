import { API_URL } from '../../environments/environment';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { Sort } from '@angular/material';

import { State } from '../_model/index';


@Injectable()
export class StateService {

  URL = `${API_URL}state/`;

  constructor(private _http: HttpClient) { }

  getAll (limit?: number, offset?: number, search?: string|null, sort?: Sort|null): Observable<any> {
    let query = '?';

    if (query !== null && offset !== null) {
      query += `limit=${limit}&offset=${offset}`;
    }

    if (search !== null && search !== '') {
      query += `&search=${search}`;
    }

    if (sort !== null && sort.direction !== '') {
      query += `&ordering=${sort.direction === 'desc' ? '-' : ''}${sort.active}`;
    }

    const url = this.URL + query;
    return this._http.get(url)
    .pipe(
      tap(_ => console.log(`${this.constructor.name}: get ${url}`)),
      catchError(this.handleError(`${this.constructor.name}: get ${url}`))
    );
  }

  get(id: string): Observable<State> {
    const url = `${this.URL}${id}/`;
    return this._http.get<State>(url)
    .pipe(
      tap(_ => console.log(`${this.constructor.name}: get ${url}`)),
      catchError(this.handleError<State>(`${this.constructor.name}: get ${url}`))
    );
  }

  save(state: State) {
    let url: string;
    const body = {name: state.name};
    if (state.id === undefined) {
       url = `${this.URL}`;
       return this._http.post(url, body)
       .pipe(
         tap(_ => console.log(`${this.constructor.name}: post ${url} body=${body}`)),
         catchError(this.handleError(`${this.constructor.name}: post ${url} body=${body}`))
       );
    } else {
       url = `${this.URL}${state.id}/`;
       return this._http.put(url, body)
       .pipe(
         tap(_ => console.log(`${this.constructor.name}: post ${url} body=${body}`)),
         catchError(this.handleError(`${this.constructor.name}: post ${url} body=${body}`))
       );
    }
  }

  delete(id: string) {
    const url = `${this.URL}${id}/`;
    return this._http.delete(url)
    .pipe(
      tap(_ => console.log(`${this.constructor.name}: delete ${url}`)),
      catchError(this.handleError(`${this.constructor.name}: delete ${url}`))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return Observable.of(error);
    };
  }

}
