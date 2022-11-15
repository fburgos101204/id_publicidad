import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { LotteryService } from './lottery.service'
import Swal from 'sweetalert2'
import { NgForm } from '@angular/forms';
declare const $: any;

@Component({
  selector: 'app-lottery',
  templateUrl: './lottery.component.html',
  styleUrls: ['./lottery.component.css']
})
export class LotteryComponent implements OnInit {

  @ViewChild('crearLottery', { read: NgForm }) crearLottery: any;
  @ViewChild('payLottery', { read: NgForm }) payLottery: any;
  /* @ViewChild('customFileLang') inputcustomFileLang: ElementRef<HTMLInputElement>; // Logo
   @ViewChild('lotteryNameEdit') lotteryNameEdit: ElementRef;
   @ViewChild('horaAperturaEdit') inputhoraApertura: ElementRef<HTMLInputElement>;
   @ViewChild('horaCierreEdit') inputhoraCierre: ElementRef<HTMLInputElement>;*/

  allData: any
  dataAvailable: boolean = false
  dataUnavailable: boolean = false
  dataToShow: any
  title: string = 'Loterías'
  titleTwo: string = 'loterías'
  closeResult: string = ''
  showLoaderSave = false
  errorFormSave: boolean = false
  errorMessageForm: string

  // Edit Values
  customFileLang: any // Logo
  lotteryNameEdit: string = '' // Nombre de loteria
  horaAperturaEdit: any
  horaCierreEdit: any
  lotteryid: number
  namelotterySet: string

  // Values Lottery Pay
  quinielaPay: number
  palePay: number
  tripletaPay: number
  superPalePay: number

  quinielaBb: number
  paleBb: number
  tripletaBb: number
  superPaleBb: number
  lotteryBlockId: number

  datosTable: any = {
    language: {
      url: "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json",
    }
  }

  constructor(
    private router: Router,
    private lotteryService: LotteryService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    let setting = this.datosTable
    let title = this.title
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login'])
    }
    this.listLottery()
    setTimeout(function () {
      $(function () {
        $('#tableLottery').DataTable(setting);
      });
    }, 1000);
  }

  open(crearUser: any) {
    this.modalService.open(crearUser, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.errorFormSave = false
      console.log(`Closed with: ${result}`)
    }, (reason) => {
      console.log(`Dismissed ${this.getDismissReason(reason)}`)
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  editLotterySet(data) {
    console.log(data)
    this.customFileLang = data.logo
    this.lotteryNameEdit = data.name.trim()
    this.horaAperturaEdit = data.open_time
    this.horaCierreEdit = data.closed_time
    this.lotteryid = data.id
  }

  formatCero(number) {
    let value;
    if (number == 0) {
      value = '0' + number
    } else if (number < 10) {
      value = '0' + number
    } else {
      value = number
    }
    return value
  }
  // Listado de loterias
  listLottery() {
    this.lotteryService.listLottery().subscribe({
      next: (data: any) => {
        this.allData = data
        console.log(data.lotteries)
        if (!data || data == '' || data == '[]') {
          this.dataAvailable = false
          this.dataUnavailable = true
        } else {
          this.dataToShow = data.lotteries
          this.dataUnavailable = false
          this.dataAvailable = true
        }
      },
      error: (error) => {
        console.log('Error: ')
        console.log(error)
      },
    })
  }

  // Crear loterias
  createLotteryFunction(formData: any) {
    console.log(formData)
    if (formData.lotteryName == '' || formData.lotteryName == null || formData.lotteryName.trim().length < 3) {
      this.errorFormSave = true
      this.errorMessageForm = 'Nombre loteria debe de tener un minimo de 3 caracteres'
    } else if (formData.horaApertura == '' || formData.horaApertura == null) {
      this.errorFormSave = true
      this.errorMessageForm = 'La hora de apertura no puede ir vacia'
    } else if (formData.horaCierre == '' || formData.horaCierre == null) {
      this.errorFormSave = true
      this.errorMessageForm = 'La hora de cierre no puede ir vacia'
    } else {
      this.lotteryService.SavedLottery(formData).subscribe({
        next: (res: any) => {
          console.log(res)
          this.errorFormSave = false
          if (res.error == false) {
            this.listLottery()
            this.modalService.dismissAll()
            Swal.fire(
              'Excelente!',
              res.message,
              'success'
            )
          } else {
            Swal.fire(
              'Error!',
              res.message,
              'warning'
            )
          }
        },
        error: (error) => {
          Swal.fire(error)
          console.log(error);
          this.showLoaderSave = false;
          console.log('Entre aqui')
        },
      });
    }
  }

  // Actulizar numero ganadores
  createWinnersFunction(formData: any) {
    console.log(formData)
    if (formData.lotteryNameWinner == '' || formData.lotteryNameWinner == null) {
      this.errorFormSave = true
      this.errorMessageForm = 'Por favor debe seleccionar una loteria'
    } else if (formData.primerPremio == '' || formData.primerPremio == null || formData.primerPremio.trim().length < 2) {
      this.errorFormSave = true
      this.errorMessageForm = 'Por favor introducir un numero valido en el primer premio'
    } else if (formData.segundoPremio == '' || formData.segundoPremio == null || formData.segundoPremio.trim().length < 2) {
      this.errorFormSave = true
      this.errorMessageForm = 'Por favor introducir un numero valido en el segundo premio'
    } else if (formData.tercerPremio == '' || formData.tercerPremio == null || formData.tercerPremio.trim().length < 2) {
      this.errorFormSave = true
      this.errorMessageForm = 'Por favor introducir un numero valido en el tercer premio'
    } else {
      this.lotteryService.SavedWinnerNumber(formData).subscribe({
        next: (res: any) => {
          console.log(res)
          this.errorFormSave = false
          if (res.error == false) {
            this.listLottery()
            this.modalService.dismissAll()
            Swal.fire(
              'Excelente!',
              res.message,
              'success'
            )
          } else {
            Swal.fire(
              'Error!',
              'Error al actulizar los numero ganadores',
              'warning'
            )
          }
        },
        error: (error) => {
          Swal.fire(error)
          console.log(error);
          this.showLoaderSave = false;
          console.log('Entre aqui')
        },
      });
    }
  }

  // Desactivar loteria
  desactivarLoteria(id: number, active: any) {

    let setText = active == true ? 'desactivar' : 'activar'
    let setTextTwo = active == true ? 'desactivarse' : 'activarse'
    let setValueUpdate = active == true ? false : true

    Swal.fire({
      title: 'Alerta!',
      text: `Seguro que quieres ${setText} esta loteria ?`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonColor: '#5e72e4',
      cancelButtonColor: '#f5365c',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.isConfirmed) {
        this.lotteryService.desactivarLoteria(id, setValueUpdate).subscribe({
          next: (data: any) => {
            console.log(data)
            this.listLottery()
            Swal.fire(
              'Excelente!',
              data.message,
              'success'
            )
          },
          error: (error) => {
            Swal.fire(
              'Error!',
              'Esta loteria no pudo ' + setTextTwo,
              'warning'
            )
            console.log('Error: ')
            console.log(error)
          },
        })

      }
    })
  }

  // Editar loteria (Ojo falta el API 28/08/2022)
  editLotteryFunction(formDatas: any) {
    console.log(formDatas)
    console.log('Entre aqui editLotteryFunction()')
    if (formDatas.lotteryNameEdit == '' || formDatas.lotteryNameEdit == null) {
      this.errorFormSave = true
      this.errorMessageForm = 'Nombre loteria debe de tener un minimo de 3 caracteres'
    } else if (formDatas.horaAperturaEdit == '' || formDatas.horaAperturaEdit == null) {
      this.errorFormSave = true
      this.errorMessageForm = 'La hora de apertura no puede ir vacia'
    } else if (formDatas.horaCierreEdit == '' || formDatas.horaCierreEdit == null) {
      this.errorFormSave = true
      this.errorMessageForm = 'La hora de cierre no puede ir vacia'
    } else {
      this.lotteryService.EditLottery(formDatas).subscribe({
        next: (res: any) => {
          console.log(res)
          this.errorFormSave = false
          if (res.error == false) {
            this.listLottery()
            this.modalService.dismissAll()
            Swal.fire(
              'Excelente!',
              res.message,
              'success'
            )
          } else {
            Swal.fire(
              'Error!',
              'Error al editar esta loteria',
              'warning'
            )
          }
        },
        error: (error) => {
          Swal.fire(error)
          console.log(error);
          this.showLoaderSave = false;
          console.log('Entre aqui')
        },
      });
    }
  }

  // Setear valores lo que paga por loterias
  payTypePlaysValues(loteria: string, item: any) {
    this.namelotterySet = loteria
    this.quinielaPay = item.quiniela
    this.palePay = item.pale
    this.tripletaPay = item.tripleta
    this.superPalePay = item.superpale
    this.lotteryBlockId = item.id
  }

  BlokcTypePlaysValues(loteria: string, item: any) {
    this.namelotterySet = loteria
    this.quinielaBb = item.quinielablock
    this.paleBb = item.paleblock
    this.tripletaBb = item.tripletablock
    this.superPaleBb = item.superpaleblock
    this.lotteryBlockId = item.id
  }

  // Guardar cuanto paga por tipo de jugada cada loteria
  savdPayLottery(formData: any) {
    console.log(formData)

    if (formData.quiniela == '' || formData.quiniela == null) {
      this.errorFormSave = true
      this.errorMessageForm = 'El campo quiniela no puede ir vacio'
    } else if (formData.pale == '' || formData.pale == null) {
      this.errorFormSave = true
      this.errorMessageForm = 'El campo pale no puede ir vacio'
    } else if (formData.tripleta == '' || formData.tripleta == null) {
      this.errorFormSave = true
      this.errorMessageForm = 'El campo tripleta no puede ir vacio'
    } else if (formData.superPale == '' || formData.superPale == null) {
      this.errorFormSave = true
      this.errorMessageForm = 'El campo super pale no puede ir vacio'
    } else {
      this.lotteryService.updateLotterySorteos(formData).subscribe({
        next: (res: any) => {
          console.log(res)
          this.errorFormSave = false
          if (res.error == false) {
            //this.listLottery()
            this.modalService.dismissAll()
            Swal.fire(
              'Excelente!',
              res.message,
              'success'
            )
          } else {
            Swal.fire(
              'Error!',
              'Error al actulizar los pagos de la loteria',
              'warning'
            )
          }
        },
        error: (error) => {
          Swal.fire(error)
          console.log(error);
          this.showLoaderSave = false;
          console.log('Entre aqui')
        },
      });
    }

  }

  // Guardar bloqueos de loteria por tipo de jugada
  savdBloqueoLottery(formData: any) {
    console.log(formData)

    if (formData.quiniela2 == '' || formData.quiniela2 == null) {
      this.errorFormSave = true
      this.errorMessageForm = 'El campo quiniela no puede ir vacio'
    } else if (formData.pale2 == '' || formData.pale2 == null) {
      this.errorFormSave = true
      this.errorMessageForm = 'El campo pale no puede ir vacio'
    } else if (formData.tripleta2 == '' || formData.tripleta2 == null) {
      this.errorFormSave = true
      this.errorMessageForm = 'El campo tripleta no puede ir vacio'
    } else if (formData.superPale2 == '' || formData.superPale2 == null) {
      this.errorFormSave = true
      this.errorMessageForm = 'El campo super pale no puede ir vacio'
    } else {
      this.lotteryService.updateLotteryLimit(formData).subscribe({
        next: (res: any) => {
          console.log(res)
          this.errorFormSave = false
          if (res.error == false) {
            //this.listLottery()
            this.modalService.dismissAll()
            Swal.fire(
              'Excelente!',
              res.message,
              'success'
            )
          } else {
            Swal.fire(
              'Error!',
              'Error al actulizar los limites de la loteria',
              'warning'
            )
          }
        },
        error: (error) => {
          Swal.fire(error)
          console.log(error);
          this.showLoaderSave = false;
          console.log('Entre aqui')
        },
      });
    }

  }


}
