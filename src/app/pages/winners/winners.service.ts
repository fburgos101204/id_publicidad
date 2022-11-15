import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable, of, throwError, tap, Subject } from 'rxjs'
import { catchError, retry, map } from 'rxjs/operators'
import { IP, IP_LOCAL, basicAuthorization } from '../../ip'

@Injectable({
  providedIn: 'root'
})
export class WinnersService {

  private apiUrl = IP
  token: any
  localToken: any = localStorage.getItem('token')
  basicAuthorizationSet = basicAuthorization

  constructor(
    private http: HttpClient
  ) { }

  listWinners(){
    return this.http.get(this.apiUrl + '/winners', {
      headers: {
        token: this.localToken,
        Authorization: this.basicAuthorizationSet
      }
    })
  }
}
