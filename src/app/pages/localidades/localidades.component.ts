import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LocalidadService } from './localidades.service'
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2'
declare const $: any;

@Component({
  selector: 'app-localidades',
  templateUrl: './localidades.component.html',
  styleUrls: ['./localidades.component.css']
})
export class LocalidadesComponent implements OnInit {

  @ViewChild('createUser', { read: NgForm }) createUser: any;
  @ViewChild('editarUsers', { read: NgForm }) editarUsers: any;


  allData: any
  list: any[] = [];
  dataAvailable: boolean = false
  dataUnavailable: boolean = false
  dataToShow: any
  title: string = 'Localidades'
  titleTwo: string = 'localidades'
  closeResult: string = ''
  showLoaderSave = false
  errorFormSaveUser: boolean = false
  errorMessageForm: string
  phoneEditPass: number

  // Edit campos
  localidadEdit: any
  representanteEdit: any
  phoneNumberEdit: any
  direccionEdit: any
  //userlocalidadEditSet: any

  datosTable: any = {
    language: {
      url: "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json",
    }
  }

  constructor(
    private router: Router,
    private localidadService: LocalidadService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    let setting = this.datosTable
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login'])
    }
    this.locationList()
    setTimeout(function () {
      $(function () {
        $('#tableLocation').DataTable(setting);
      });
    }, 2000);
  }


  open(crearUser: any) {
    this.modalService.open(crearUser, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.errorFormSaveUser = false
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


  // Crear usuario (Ready)
  createLocationFunction(formData: any) {
    console.log(formData);

    if (formData.localidad == '' || formData.localidad == null ) {
      this.errorFormSaveUser = true
      this.errorMessageForm = 'Localidad no puede ir vacio'
    } else if (formData.representante == '' || formData.representante == null) {
      this.errorFormSaveUser = true
      this.errorMessageForm = 'Representante no puede ir vacio'
    } else if (formData.phoneNumber == '') {
      this.errorFormSaveUser = true
      this.errorMessageForm = 'El campo teléfono no puede ir vacío'
    } else if (formData.direccion == '') {
      this.errorFormSaveUser = true
      this.errorMessageForm = 'El campo direccion no puede ir vacío'
    } else {
      this.localidadService.createLocalidad(formData).subscribe({
        next: (res: any) => {
          console.log(res)
          this.errorFormSaveUser = false
          if (res.error == false) {
            this.locationList()
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

  // Editar usuario (Ready)
  editLocation(formData: any) {
    console.log(formData);
    let id = 1
    if (formData.localidadEdit == '' || formData.localidadEdit == null ) {
      this.errorFormSaveUser = true
      this.errorMessageForm = 'Localidad no puede ir vacio'
    } else if (formData.representanteEdit == '' || formData.representanteEdit == null) {
      this.errorFormSaveUser = true
      this.errorMessageForm = 'Representante no puede ir vacio'
    } else if (formData.phoneNumberEdit == '') {
      this.errorFormSaveUser = true
      this.errorMessageForm = 'El campo teléfono no puede ir vacío'
    } else if (formData.direccionEdit == '') {
      this.errorFormSaveUser = true
      this.errorMessageForm = 'El campo direccion no puede ir vacío'
    } else {
      this.localidadService.editLocation(formData, id).subscribe({
        next: (res: any) => {
          console.log(res)
          this.errorFormSaveUser = false
          if (res.error == false) {
            this.locationList()
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

  //(Ready)
  setPhone(phone: number) {
    this.phoneEditPass = phone
  }

  //(Ready)
  locationList() {
    this.localidadService.locationList().subscribe({
      next: (data: any) => {
        this.allData = data
        console.log(data)
        if (!data || data == '' || data == '[]') {
          this.dataAvailable = false
          this.dataUnavailable = true
        } else {
          this.dataToShow = data
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

  // Desactivar localidad (Ready)
  localidadDisabled(id: number) {

    Swal.fire({
      title: 'Alerta!',
      text: "Seguro que quieres desactivar esta localidad ?",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonColor: '#5e72e4',
      cancelButtonColor: '#f5365c',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.isConfirmed) {

        this.localidadService.localidadDisabled(id).subscribe({
          next: (data: any) => {
            console.log(data)
            this.locationList()
            Swal.fire(
              'Excelente!',
              data.message,
              'success'
            )
          },
          error: (error) => {
            Swal.fire(
              'Error!',
              'localidad no pudo desactivarse',
              'warning'
            )
            console.log('Error: ')
            console.log(error)
          },
        })

      }
    })
  }

  // Activar localidad (Ready)
  localidadActive(id: number) {

    Swal.fire({
      title: 'Alerta!',
      text: "Seguro que quieres activar esta localidad ?",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonColor: '#5e72e4',
      cancelButtonColor: '#f5365c',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.isConfirmed) {

        this.localidadService.localidadActive(id).subscribe({
          next: (data: any) => {
            console.log(data)
            this.locationList()
            Swal.fire(
              'Excelente!',
              data.message,
              'success'
            )
          },
          error: (error) => {
            Swal.fire(
              'Error!',
              'Usuario no pudo desactivarse',
              'warning'
            )
            console.log('Error: ')
            console.log(error)
          },
        })

      }
    })
  }


  // Solo acepta numeros (Ready)
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  stringOnly(events): boolean {
    var inputValue = events.charCode;
    if (!(inputValue >= 65 && inputValue <= 120) && (inputValue != 32 && inputValue != 0)) {
      events.preventDefault();
      return false;
    }
    return true;
  }

  stringOnly2 = (text) => {
    return text.match(/^[a-zA-Z]+$/);
  };

  // Rellenar campos para editar (Ready)
  refillEditUser(data: any) {
    console.log(data)
    this.localidadEdit = data.localidad
    this.representanteEdit = data.representante
    this.phoneNumberEdit = data.telefono
    this.direccionEdit = data.direccion
  }


}
