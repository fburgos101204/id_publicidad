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
export class CuentasService {

  //private apiUrl = IP
  private apiUrl = IP_LOCAL
  token: any
  localToken: any = localStorage.getItem('token')
  basicAuthorizationSet = basicAuthorization

  constructor(
    private http: HttpClient
  ) { }
  
  // Listar todos los usuarios (ready)
  userList(){
    return this.http.get(this.apiUrl + '/users', {
      headers: {
        token: this.localToken,
        Authorization: this.basicAuthorizationSet
      }
    })
  }
  
  // Informacion del usuario logged (ready)
  userInfo(){
    return this.http.get(this.apiUrl + '/users/findOne', {
      headers: {
        token: this.localToken,
        Authorization: this.basicAuthorizationSet
      }
    })
  }

  // Desactivar un usuario (ready)
  userDisabled(id: number){
    return this.http.put(this.apiUrl + '/users/disabled/'+id, {
      headers: {
        token: this.localToken,
        Authorization: this.basicAuthorizationSet
      }
    })
  }

  // Activar un usuario (ready)
  userActive(id: number){
    return this.http.put(this.apiUrl + '/users/active/'+id, {
      headers: {
        token: this.localToken,
        Authorization: this.basicAuthorizationSet
      }
    })
  }

  // Crear un usuario (Ready)
  createUser(formData: any){
    console.log(formData[0])
    let value = this.http.post(
      this.apiUrl + '/users/add',
      {
        nombre: formData.name,
        apellido: formData.lastName,
        password: formData.password,
        correo: formData.email,
        username: formData.Username
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

  // Editar un usuario (Ready)
  editUserManager(formData: any){
    console.log(formData[0])
    let value = this.http.put(
      this.apiUrl + '/users/edit/manager',
      {
        nombre: formData.nameEdit,
        apellido: formData.lastNameEdit,
        correo: formData.emailEdit,
        username: formData.UsernameEdit
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

  // Actualizar contraseña del manager (Ready)
  editPassword(formData: any){
    let value = this.http.put(
      this.apiUrl + '/users/updatePass',
      {
        correo: formData.phoneEe,
        password: formData.passwordEdit
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

  deleteUserManager(id: number){
    return this.http.delete(this.apiUrl + '/users/manager/delete/'+id, {
      headers: {
        token: this.localToken,
        Authorization: this.basicAuthorizationSet
      }
    })
  }

}
