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
export class PublicidadService {

  //private apiUrl = IP
  private apiUrl = IP_LOCAL
  token: any
  localToken: any = localStorage.getItem('token')
  basicAuthorizationSet = basicAuthorization

  constructor(
    private http: HttpClient
  ) { }

  // Listado de publicidad (ready)
  publicidadList() {
    return this.http.get(this.apiUrl + '/publicidad/list', {
      headers: {
        token: this.localToken,
        Authorization: this.basicAuthorizationSet
      }
    })
  }

  // Desactivar publicidad (ready)
  publicidadDisabled(id: number) {
    return this.http.put(this.apiUrl + '/publicidad/disabled/' + id, {
      headers: {
        token: this.localToken,
        Authorization: this.basicAuthorizationSet
      }
    })
  }

  // Activar publicidad (ready)
  publicidadActive(id: number) {
    return this.http.put(this.apiUrl + '/publicidad/enabled/' + id, {
      headers: {
        token: this.localToken,
        Authorization: this.basicAuthorizationSet
      }
    })
  }

  // Crear una publicidad (Ready)
  createPublicidad(formData: any) {
    console.log('Objeto de creacion: ', formData)
    let value = this.http.post(
      this.apiUrl + '/publicidad/add',
      {
        foto: formData.foto,
        id_localidad: formData.localidad,
        fecha_creacion: new Date(),
        fecha_inicio: formData.fechaInicio,
        fecha_vencimiento: formData.fechaFin,
        loop: formData.loop,
        usuario_created: localStorage.getItem('nombreCliente')
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

  // Editar una publicidad (Ready)
  editPublicidad(formData: any) {
    console.log('llego al edit: ', formData)
    let value = this.http.put(
      this.apiUrl + '/publicidad/update',
      {
        id: formData.id,
        foto: formData.fotoEdit,
        id_localidad: formData.localidadEdit,
        fecha_inicio: formData.fechaInicioEdit,
        loop: formData.loope,
        fecha_vencimiento: formData.fechaFinEdit,
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

  // Todas las localidades (Ready)
  listLocalidad() {
    return this.http.get(this.apiUrl + '/location/list', {
      headers: {
        token: this.localToken,
        Authorization: this.basicAuthorizationSet
      }
    })
  }

  deletePublicidad(id: number) {
    return this.http.delete(this.apiUrl + '/publicidad/delete/' + id, {
      headers: {
        token: this.localToken,
        Authorization: this.basicAuthorizationSet
      }
    })
  }

}
