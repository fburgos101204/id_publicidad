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
export class DashboardService {

  private apiUrl = IP
  token: any
  localToken: any = localStorage.getItem('token')
  basicAuthorizationSet = basicAuthorization

  constructor(
    private http: HttpClient
  ) { }

  formatCero(numbers) {
    let values;
    if (numbers < 10) {
      values = '0' + numbers
    } else {
      values = numbers
    }
    return values
  }

  /*
  let hoy = new Date();
  let fecha = hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + this.formatCero(hoy.getDate());
  let hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
  */

  // CANTIDAD DE JUGADAS
  playsCant() {
    return this.http.get(this.apiUrl + '/playsCant', {
      headers: {
        token: this.localToken,
        Authorization: this.basicAuthorizationSet
      }
    })
  }

  // TOTAL EN PREMIOS
  premios() {
    return this.http.get(this.apiUrl + `/premiosDas`, {
      headers: {
        token: this.localToken,
        Authorization: this.basicAuthorizationSet
      }
    })
  }

  // VENTA DE RECARGA
  recargasList() {
    let hoy = new Date();
    let fecha = hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + this.formatCero(hoy.getDate());
    let hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();

    return this.http.get(this.apiUrl + `/recargasDas/${fecha}`, {
      headers: {
        token: this.localToken,
        Authorization: this.basicAuthorizationSet
      }
    })
  }

  // VENTAS DEL DIA
  salesDay() {
    return this.http.get(this.apiUrl + '/salesDay', {
      headers: {
        token: this.localToken,
        Authorization: this.basicAuthorizationSet
      }
    })
  }

  // TOTAL APOSTADO
  totalPlaysAmount() {
    return this.http.get(this.apiUrl + '/totalPlaysAmount', {
      headers: {
        token: this.localToken,
        Authorization: this.basicAuthorizationSet
      }
    })
  }

  // CLIENTES REGISTRADOS
  allCustomers() {
    return this.http.get(this.apiUrl + '/allCustomers', {
      headers: {
        token: this.localToken,
        Authorization: this.basicAuthorizationSet
      }
    })
  }

  // LOTERIAS REGISTRADAS
  cantLottery() {
    return this.http.get(this.apiUrl + '/cantLottery', {
      headers: {
        token: this.localToken,
        Authorization: this.basicAuthorizationSet
      }
    })
  }

  // LISTADO DE JUGADAS DE HOY
  listPlaysToday() {
    return this.http.get(this.apiUrl + '/listPlaysToday', {
      headers: {
        token: this.localToken,
        Authorization: this.basicAuthorizationSet
      }
    })
  }

  // GANANCIAS POR LOTERIA
  winByLottery() {
    return this.http.get(this.apiUrl + '/winByLottery', {
      headers: {
        token: this.localToken,
        Authorization: this.basicAuthorizationSet
      }
    })
  }
  // CLIENTES ACTIVOS
  activeCustomer() {
    return this.http.get(this.apiUrl + '/activeCustomer', {
      headers: {
        token: this.localToken,
        Authorization: this.basicAuthorizationSet
      }
    })
  }

}
