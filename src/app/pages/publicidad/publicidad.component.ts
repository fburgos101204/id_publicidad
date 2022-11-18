import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PublicidadService } from './publicidad.service'
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2'
import { Publicidad } from './interface/publicidad.interface';
import { fromEventPattern } from 'rxjs';
declare const $: any;

@Component({
  selector: 'app-publicidad',
  templateUrl: './publicidad.component.html',
  styleUrls: ['./publicidad.component.css']
})
export class PublicidadComponent implements OnInit {

  @ViewChild('createUser', { read: NgForm }) createUser: any;
  @ViewChild('editarUsers', { read: NgForm }) editarUsers: any;


  publicityList: Publicidad[] = [];
  localityList: any[] = [];
  list: any[] = [];
  dataAvailable: boolean = false
  dataUnavailable: boolean = false
  dataToShow: any
  dataToShowLoc: any
  title: string = 'Publicidad'
  titleTwo: string = 'publicidad'
  closeResult: string = ''
  showLoaderSave = false
  errorFormSaveUser: boolean = false
  errorMessageForm: string
  phoneEditPass: number

  // Edit campos
  fotoEdit: any;
  id: any;
  localidadEditId: any;
  fechaInicioEdit: any;
  fechaFinEdit: any;
  loop: any;

  datosTable: any = {
    language: {
      url: "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json",
    }
  }

  constructor(
    private router: Router,
    private publicidadService: PublicidadService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    let setting = this.datosTable
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login'])
    }
    this.publicidadList()
    this.listLocalidad()
    setTimeout(function () {
      $(function () {
        $('#tableUser').DataTable(setting);
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

  // Crear publicidad (Ready)
  createPublicidad(formData: any) {
    console.log('data del formulario: ', formData);

    if (formData.foto == '' || formData.foto == null) {
      this.errorFormSaveUser = true;
      this.errorMessageForm = 'Debes subir una foto. No puedes dejar el campo foto vacio.';
    } else if (!formData.localidad) {
      this.errorFormSaveUser = true;
      this.errorMessageForm = 'Debes elegir una localidad.';
    } else if (!formData.fechaInicio) {
      this.errorFormSaveUser = true;
      this.errorMessageForm = 'Debes seleccionar una fecha de inicio.';
    } else if (!formData.fechaFin) {
      this.errorFormSaveUser = true;
      this.errorMessageForm = 'Debes seleccionar una fecha de fin.';
    } else if (!formData.loop) {
      this.errorFormSaveUser = true;
      this.errorMessageForm = 'Debes seleccionar un loop';
    } else {
      this.publicidadService.createPublicidad(formData).subscribe({
        next: (res: any) => {
          console.log(res)
          this.errorFormSaveUser = false;
          if (res.error == false) {
            this.publicidadList();
            this.modalService.dismissAll();
            Swal.fire(
              'Excelente!',
              res.message,
              'success'
            );
          } else {
            Swal.fire(
              'Error!',
              res.message,
              'warning'
            );
          }
        },
        error: (error) => {
          Swal.fire(error)
          console.log(error);
          this.showLoaderSave = false;
        },
      });
    }
  }

  // Editar publicidad (Ready)
  editPublicidad(formData: any) {
    console.log('editData', formData);
    formData.id = this.id;

    if(!formData.fotoEdit) {
      formData.fotoEdit = this.fotoEdit;
    }
    console.log('editData2: ', formData);


    this.publicidadService.editPublicidad(formData).subscribe({
      next: (res: any) => {
        console.log(res)
        this.errorFormSaveUser = false
        if (res.error == false) {
          this.publicidadList()
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
        this.modalService.dismissAll()
        Swal.fire(error)
        console.log(error);
        this.showLoaderSave = false;
        console.log('Entre aqui')
      },
    });
  }

  // Listado de localidades
  listLocalidad() {
    this.publicidadService.listLocalidad().subscribe({
      next: (data: any) => {
        this.localityList = data
        console.log(data)
        if (!data || data == '' || data == '[]') {
          this.dataAvailable = false
          this.dataUnavailable = true
        } else {
          this.dataToShowLoc = data
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

  //(Ready)
  setPhone(phone: number) {
    this.phoneEditPass = phone
  }

  //(Ready)
  publicidadList() {
    this.publicidadService.publicidadList().subscribe({
      next: (data: any) => {
        this.publicityList = data;
        debugger;
        console.log(data)
      },
      error: (error) => {
        debugger;
        console.log('Error: ')
        console.log(error)
      },
    })
  }

  // Desactivar publicidad (Ready)
  publicidadDisabled(id: number) {
    Swal.fire({
      title: 'Alerta!',
      text: "Seguro que quieres desactivar esta publicidad ?",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonColor: '#5e72e4',
      cancelButtonColor: '#f5365c',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.isConfirmed) {
        this.publicidadService.publicidadDisabled(id).subscribe({
          next: (data: any) => {
            console.log(data)
            this.publicidadList()
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

  // Activar publicidad (Ready)
  publicidadActive(id: number) {
    Swal.fire({
      title: 'Alerta!',
      text: "Seguro que quieres activar esta publicidad ?",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonColor: '#5e72e4',
      cancelButtonColor: '#f5365c',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.isConfirmed) {
        this.publicidadService.publicidadActive(id).subscribe({
          next: (data: any) => {
            console.log(data)
            this.publicidadList()
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
  refillEditPublicity(data: any) {
    console.log('refillDate', data);
    this.localidadEditId = data.id_localidad;
    this.fechaInicioEdit = data.fecha_inicio;
    this.fechaFinEdit = data.fecha_vencimiento;
    this.loop = data.loope;
    this.id = data.id;
    this.fotoEdit = data.foto;
  }

  // Eliminar publicidad 
  deletePublicidad(id: number) {
    Swal.fire({
      title: 'Alerta!',
      text: "Seguro que quieres eliminar esta publicidad ?",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonColor: '#5e72e4',
      cancelButtonColor: '#f5365c',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.isConfirmed) {
        this.publicidadService.deletePublicidad(id).subscribe({
          next: (data: any) => {
            console.log(data)
            this.publicidadList()
            Swal.fire(
              'Excelente!',
              data.message,
              'success'
            )
          },
          error: (error) => {
            Swal.fire(
              'Error!',
              'Usuario no pudo eliminarse',
              'warning'
            )
            console.log('Error: ')
            console.log(error)
          },
        })

      }
    })
  }
}
