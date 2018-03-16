import { API_URL } from '../../environments/environment';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { Sort } from '@angular/material';

import { Ticket } from '../_model/index';


@Injectable()
export class TicketService {

  URL = `${API_URL}ticket/`;

  constructor(private _http: HttpClient) { }

  getAll (limit: number, offset: number, search?: string|null, sort?: Sort|null,
      state?: string|null): Observable<any> {

    let query = '';

    if (limit !== null && offset !== null) {
      query += `?limit=${limit}&offset=${offset}`;
    }

    if (search !== null && search !== '') {
      query += `&search=${search}`;
    }

    if (sort !== null && sort.direction !== '') {
      query += `&ordering=${sort.direction === 'desc' ? '-' : ''}${sort.active}`;
    }

    if (state !== null && state !== '' ) {
      query += `&state=${state}`;
    }

    const url = this.URL + query;
    return this._http.get(url)
    .pipe(
      tap(_ => console.log(`${this.constructor.name}: get ${url}`)),
      catchError(this.handleError(`${this.constructor.name}: get ${url}`))
    ).map(data => {
        for (const ticket of data['results']) {
          ticket.created_at = new Date(ticket.created_at);
        }
        return data;
      });
  }

  get(id: string): Observable<Ticket> {
    const url = `${this.URL}${id}/`;
    return this._http.get<Ticket>(url)
    .pipe(
      tap(_ => console.log(`${this.constructor.name}: get ${url}`)),
      catchError(this.handleError<Ticket>(`${this.constructor.name}: get ${url}`))
    ).map(data => {
        data.created_at = new Date(data.created_at);
        return data;
      }
    );
  }

  save(ticket: Ticket) {
    let url: string;
    const body = {
      title: ticket.title,
      description: ticket.description,
      // created_at: ticket.created_at,
      state: ticket.state,
    };

    if (ticket.id === undefined) {
       url = `${this.URL}`;
       return this._http.post(url, body)
       .pipe(
         tap(_ => console.log(`${this.constructor.name}: post ${url} body=${body}`)),
         catchError(this.handleError(`${this.constructor.name}: post ${url} body=${body}`))
       );
    } else {
       url = `${this.URL}${ticket.id}/`;
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
