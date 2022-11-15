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
export class UsersService {

  private apiUrl = IP_LOCAL
  token: any
  localToken: any = localStorage.getItem('token')
  basicAuthorizationSet = basicAuthorization

  constructor(
    private http: HttpClient
  ) { }

  // Listar todos los usuarios
  userList() {
    return this.http.get(this.apiUrl + '/users', {
      headers: {
        token: this.localToken,
        Authorization: this.basicAuthorizationSet
      }
    })
  }

  // Informacion del usuario logged
  userInfo() {
    return this.http.get(this.apiUrl + '/users/findOne', {
      headers: {
        token: this.localToken,
        Authorization: this.basicAuthorizationSet
      }
    })
  }

  // Informacion del usuario por numero de telefono
  userInfoByPhone(phone: any) {
    return this.http.get(this.apiUrl + '/usersByPhone/' + phone, {
      headers: {
        token: this.localToken,
        Authorization: this.basicAuthorizationSet
      }
    })
  }

  // Desactivar un usuario
  userDisabled(id: number) {
    return this.http.put(this.apiUrl + '/users/disabled/' + id, {
      headers: {
        token: this.localToken,
        Authorization: this.basicAuthorizationSet
      }
    })
  }

  // Crear un usuario
  createUser(formData: any) {
    console.log(formData[0])
    let value = this.http.post(
      this.apiUrl + '/users/add',
      {
        name: formData.name,
        lastName: formData.lastName,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
      },
      {
        headers: {
          token: this.localToken,
          Authorization: this.basicAuthorizationSet
        },
      });
    console.log(value);
    return value;
  }

  // Listado de transacciones
  transacciones(phone: any) {
    return this.http.get(this.apiUrl + '/allTransaccionByPhone/' + phone, {
      headers: {
        token: this.localToken,
        Authorization: this.basicAuthorizationSet
      }
    })
  }

 
  // Listado de tarjetas del cliente
  getCards(phone: any) {
    return this.http.get(this.apiUrl + '/getcards/' + phone, {
      headers: {
        token: this.localToken,
        Authorization: this.basicAuthorizationSet
      }
    })

  }

  // Agregar balance al cliente
  addBalance(formData: any, phone: any) {
    let value = this.http.put(
      this.apiUrl + '/users/addBalanceUserByPhone/' + phone,
      {
        balance: formData.monto
      },
      {
        headers: {
          token: this.localToken,
          Authorization: this.basicAuthorizationSet
        },
      });
    console.log(value);
    return value;
  }

  // Limitar monto de jugada
  limitarMonto(id: number, monto: number) {
    let value = this.http.post(
      this.apiUrl + '/amount/bloqueo',
      {
        user_id: id,
        amount: monto
      },
      {
        headers: {
          token: this.localToken,
          Authorization: this.basicAuthorizationSet
        },
      });
    console.log(value);
    return value;
  }

  // Convertir cliente en vendedor
  vendor(id: number, precent: number) {
    let value = this.http.put(
      this.apiUrl + '/users/vendor',
      {
        id: id,
        percent: precent
      },
      {
        headers: {
          token: this.localToken,
          Authorization: this.basicAuthorizationSet
        },
      });
    console.log(value);
    return value;
  }

  // Editar contraseña
  editPassword(formData: any, phone: number){
    let value = this.http.put(
      this.apiUrl + '/users/updatePass',
      {
        phone: phone,
        password: formData.passwordSet
      },
      {
        headers: {
          token: this.localToken,
          Authorization: this.basicAuthorizationSet
        },
      });
    console.log(value);
    return value;
  }

  /*let value;
  value = this.http.get(IP + '/userlog/getUserID', {
    headers: {
      token: localStorage.getItem('token'),
    },
  });
  console.log(value);
  return value;*/

  /*handleError(error: HttpErrorResponse) {
    return throwError(error.message)
  }

  httpOptions: HttpHeaders = new HttpHeaders({
    token: this.localToken,
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Authorization': 'Basic RVdhbGxldDM2NUFQSUNsaWVudDpRVkJKVTBOTVNVVk9WRUZNUVZOSlRFeEJNalE9'
  })*/
}
