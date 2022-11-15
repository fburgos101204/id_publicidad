import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Observable, of, throwError, tap, Subject } from 'rxjs'
import { catchError, retry, map } from 'rxjs/operators'
import { Router } from '@angular/router'
import { response } from 'express'
import { IP, IP_LOCAL } from '../../ip'


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = IP_LOCAL
  loggedIn: boolean = true

  constructor(
    private http: HttpClient
  ) { }

  userLog(phonenumber: string, password: string) {

    let userData = { 
      email: phonenumber, 
      password: password,
    }

    console.log(userData)
    console.log('In userLog function')
    return this.http.post(this.apiUrl + '/users/loginManager', userData, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Basic RVdhbGxldDM2NUFQSUNsaWVudDpRVkJKVTBOTVNVVk9WRUZNUVZOSlRFeEJNalE9',
        'Access-Control-Allow-Credentials': 'true'
      },
      withCredentials: true,
    })
  }

  handleError(error: HttpErrorResponse) {
    return throwError(error.message)
  }

  httpOptions: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Authorization': 'Basic RVdhbGxldDM2NUFQSUNsaWVudDpRVkJKVTBOTVNVVk9WRUZNUVZOSlRFeEJNalE9'
  })
}
