import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from './users.service'
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2'
import { UserListDto } from './dto/users.dto';
declare const $: any;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  @ViewChild('createUser', { read: NgForm }) createUser: any;


  allData: any
  list: any[] = [];
  dataAvailable: boolean = false
  dataUnavailable: boolean = false
  dataToShow: any
  title: string = 'Clientes'
  titleTwo: string = 'clientes'
  closeResult: string = ''
  showLoaderSave = false
  userListDtoModel: UserListDto[] = [];
  errorFormSaveUser: boolean = false
  errorMessageForm: string
  
  datosTable: any = {
    language: {
      url: "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json",
    }
  }

  constructor(
    private router: Router,
    private usersService: UsersService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    let setting = this.datosTable
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login'])
    }
    this.userList()
    setTimeout(function () {
      $(function () {
        $('#tableUser').DataTable(setting);
      });
    }, 2000);
  }


  open(crearUser: any) {
    this.modalService.open(crearUser, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
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

  createUserFunction(formData: any){
    console.log(formData);
    let validSet, emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    if (emailRegex.test(formData.email)) { validSet = 1; } else { validSet = 2; }

    if (formData.name == '' || formData.name == null || formData.name.trim().length < 3) {
      this.errorFormSaveUser = true
      this.errorMessageForm = 'Nombre debe de tener un minimo de 3 caracteres'
    } else if (formData.lastName == '' || formData.lastName == null || formData.lastName.trim().length < 3) {
      this.errorFormSaveUser = true
      this.errorMessageForm = 'Apellido debe de tener un minimo de 3 caracteres'
    } else if (formData.phoneNumber == '' || formData.phoneNumber == null || formData.phoneNumber.trim().length < 10) {
      this.errorFormSaveUser = true
      this.errorMessageForm ='El campo telefono no puede ir vacio y debe ser igual a 10 caracteres'
    } else if (formData.email == '' || validSet == 2) {
      this.errorFormSaveUser = true
      this.errorMessageForm ='Este correo electrónico es inválido'
    } else {
      this.usersService.createUser(formData).subscribe({
        next: (res: any) => {
         console.log(res)
         this.errorFormSaveUser = false
         if(res.error == false){
          this.userList()
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

  // Listado de usuarios
  userList() {
    this.usersService.userList().subscribe({
      next: (data: any) => {
        this.userListDtoModel = [];
        this.allData = data
        console.log(data)
        let dataFilter = data.filter(item => item.typeUser == 1)
        for (const element of dataFilter) {
          let listadoUser = new UserListDto();
          listadoUser.id = element.id;
          listadoUser.name = element.name.trim();
          listadoUser.lastName = element.lastName.trim();
          listadoUser.balance = element.balance;
          listadoUser.phoneNumber = element.phoneNumber;
          listadoUser.address = element.address;
          listadoUser.createdDate = element.createdDate;
          listadoUser.active = element.active;
          listadoUser.total = element.total;
          listadoUser.seller = element.seller;
          listadoUser.seller_percentage = element.seller_percentage;
          listadoUser.limite = element.limite;
          this.list.push(listadoUser)
          this.userListDtoModel.push(listadoUser);
        }
        console.log(this.list);
      },
      error: (error) => {
        console.log('Error: ')
        console.log(error)
      },
    })
  }
  
  // Desactivar usuario
  userDisabled(id: number, active: any){

    let setText = active == true ? 'desactivar':'activar'
    let setTextTwo = active == true ? 'desactivarse':'activarse'
    let setValueUpdate = active == true ? false : true

    Swal.fire({
      title: 'Alerta!',
      text: `Seguro que quieres ${setText} este usuario ?`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonColor: '#5e72e4',
      cancelButtonColor: '#f5365c',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.isConfirmed) {
        
        this.usersService.userDisabled(id).subscribe({
          next: (data: any) => {
            console.log(data)
            this.userList()
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

  redirectProfile(id: number){
    console.log('ID User: '+id)
    this.router.navigate([`/user-profile/${id}`])
  }

  // Bloquear cantidad de limite a jugar
  async blockAmountCustomer (id: number){
    const inputValue = 0
    const { value: monto } = await Swal.fire({
      title: 'Limitar monto de jugada',
      input: 'number',
      inputLabel: 'Introducir un monto',
      inputValue: inputValue,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value) {
          return '¡Tienes que introducir un monto valido!'
        }
      }
    })
    if (monto) {
      this.usersService.limitarMonto(id, monto).subscribe({
        next: (data: any) => {
          console.log(data)
          this.userList()
          Swal.fire(`Este cliente se ha limitado a ${monto} por el dia de hoy`)
        }
      })
      
    }
  }


  // Convertir clientes en vendedores de saldos
  async vendorAmount (id: number){
    const inputValue = 0
    const { value: precent } = await Swal.fire({
      title: 'Convertir cliente en vendedor',
      input: 'number',
      inputLabel: 'Introducir porcentaje de ganancia',
      inputValue: inputValue,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value) {
          return '¡Tienes que introducir un porcentaje valido!'
        }
      }
    })
    if (precent) {
      this.usersService.vendor(id, precent).subscribe({
        next: (data: any) => {
          console.log(data)
          this.userList()
          Swal.fire(`Este cliente se ha convertido en vendedor`)
        }
      })
      
    }
  }

}
