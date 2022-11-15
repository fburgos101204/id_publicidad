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
export class LotteryService {

  private apiUrl = IP
  token: any
  localToken: any = localStorage.getItem('token')
  basicAuthorizationSet = basicAuthorization

  constructor(
    private http: HttpClient
  ) { }
  
  // Listar loterias
  listLottery(){
    return this.http.get(this.apiUrl + '/lottery', {
      headers: {
        token: this.localToken,
        Authorization: this.basicAuthorizationSet
      }
    })
  }

  // Guardar Loterias
  SavedLottery(formData: any){
    let date = new Date();

    return this.http.post(this.apiUrl + '/lottery/add', 
    {
      name: formData.lotteryName,
      date_created: '2022-08-25',
      open_time: JSON.stringify(date),
      closed_time: JSON.stringify(date),
      logo: 'https://w7.pngwing.com/pngs/517/139/png-transparent-loterias-y-apuestas-del-estado-lottery-lotaria-nacional-de-espana-result-raffle-torrent-logo-logo-number-lottery-thumbnail.png'
    },
    {
      headers: {
        token: this.localToken,
        Authorization: this.basicAuthorizationSet
      }
    })
  }

  // Editar loteria
  EditLottery(formData: any){
    console.log(formData)
    return this.http.put(this.apiUrl + '/lottery/edit/'+formData.lotteryid, 
    {
      name: formData.lotteryNameEdit,
      open_time: formData.horaAperturaEdit,
      closed_time: formData.horaCierreEdit
    },
    {
      headers: {
        token: this.localToken,
        Authorization: this.basicAuthorizationSet
      }
    })
  }

  // Insertar numero ganadores
  SavedWinnerNumber(formData: any){
    console.log(formData)
    return this.http.put(this.apiUrl + '/lottery/'+formData.lotteryNameWinner, 
    {
      numberOne: formData.primerPremio,
      numberTwo: formData.segundoPremio,
      numberThreee: formData.tercerPremio
    },
    {
      headers: {
        token: this.localToken,
        Authorization: this.basicAuthorizationSet
      }
    })
  }
  
  // Desactivar Loteria
  desactivarLoteria(id: number, setValueUpdate: any){
    console.log(id)
    return this.http.put(this.apiUrl + '/lottery/disabled/'+id, 
    {
      set: setValueUpdate,
    },
    {
      headers: {
        token: this.localToken,
        Authorization: this.basicAuthorizationSet
      }
    })
  }

  //lottery/updateLotteryLimit
  // Actulizar limite de bloqueo por loteria
  updateLotteryLimit(formData: any){
    console.log(formData)
    return this.http.put(this.apiUrl + '/lottery/updateLotteryLimit2/set', 
    {
      quiniela:  formData.quiniela2,
      pale: formData.pale2,
      tripleta: formData.tripleta2,
      superpale:  formData.superPale2,
      lottery: formData.lotteryBlockId
    },
    {
      headers: {
        token: this.localToken,
        Authorization: this.basicAuthorizationSet
      }
    })
  }

  // Actulizar cuanto paga por tipo de jugada las loterias
  updateLotterySorteos(formData: any){
    console.log(formData)
    return this.http.put(this.apiUrl + '/lottery/updateLotterySorteos/pay', 
    {
      quiniela:  formData.quiniela,
      pale: formData.pale,
      tripleta: formData.tripleta,
      superpale:  formData.superPale,
      lottery: formData.lotteryBlockId
    },
    {
      headers: {
        token: this.localToken,
        Authorization: this.basicAuthorizationSet
      }
    })
  }
}
