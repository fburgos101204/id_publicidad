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
export class LocalidadService {

  //private apiUrl = IP
  private apiUrl = IP_LOCAL
  token: any
  localToken: any = localStorage.getItem('token')
  basicAuthorizationSet = basicAuthorization

  constructor(
    private http: HttpClient
  ) { }
  
  // Todas las localidades (Ready)
  locationList(){
    return this.http.get(this.apiUrl + '/location/list', {
      headers: {
        token: this.localToken,
        Authorization: this.basicAuthorizationSet
      }
    })
  }
  

  // Desactivar una localidad (ready)
  localidadDisabled(id: number){
    return this.http.put(this.apiUrl + '/location/disabled/'+id, {
      headers: {
        token: this.localToken,
        Authorization: this.basicAuthorizationSet
      }
    })
  }

  // Activar una localidad (ready)
  localidadActive(id: number){
    return this.http.put(this.apiUrl + '/location/enabled/'+id, {
      headers: {
        token: this.localToken,
        Authorization: this.basicAuthorizationSet
      }
    })
  }

  /*
    localidad: req.body.localidad,
    direccion: req.body.direccion,
    telefono: req.body.telefono,
    foto: req.body.foto,
    representante: req.body.representante,
    */

  // Crear un usuario (Ready)
  createLocalidad(formData: any){
    console.log(formData[0])
    let value = this.http.post(
      this.apiUrl + '/location/add',
      {
        localidad: formData.localidad,
        direccion: formData.direccion,
        telefono: formData.phoneNumber,
        representante: formData.representante
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
  editLocation(formData: any, id: number){
    console.log(formData[0])
    let value = this.http.put(
      this.apiUrl + '/location/update/'+id,
      {
        localidad: formData.localidadEdit,
        direccion: formData.direccionEdit,
        telefono: formData.phoneNumberEdit,
        representante: formData.representanteEdit
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

}
