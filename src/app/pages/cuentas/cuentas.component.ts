import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CuentasService } from './cuentas.service'
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2'
import { UserListDto } from './dto/users.dto';
declare const $: any;

@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.css']
})
export class CuentasComponent implements OnInit {

  @ViewChild('createUser', { read: NgForm }) createUser: any;
  @ViewChild('editarUsers', { read: NgForm }) editarUsers: any;


  allData: any
  list: any[] = [];
  dataAvailable: boolean = false
  dataUnavailable: boolean = false
  dataToShow: any
  title: string = 'Usuarios'
  titleTwo: string = 'usuario'
  closeResult: string = ''
  showLoaderSave = false
  userListDtoModel: UserListDto[] = [];
  errorFormSaveUser: boolean = false
  errorMessageForm: string
  phoneEditPass: number

  // Edit campos
  nameEdit: any
  lastNameEditSet: any
  phoneEditSet: any
  emailEditSet: any
  usernameEditSet: any

  datosTable: any = {
    language: {
      url: "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json",
    }
  }

  constructor(
    private router: Router,
    private cuentasService: CuentasService,
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

  validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  // Crear usuario (Ready)
  createUserFunction(formData: any) {
    console.log(formData);
    let validSet, emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    if (emailRegex.test(formData.email)) { validSet = 1; } else { validSet = 2; }

    if (formData.name == '' || formData.name == null || formData.name.trim().length < 3) {
      this.errorFormSaveUser = true
      this.errorMessageForm = 'Nombre debe de tener un mínimo de 3 caracteres'
    } else if (formData.lastName == '' || formData.lastName == null || formData.lastName.trim().length < 3) {
      this.errorFormSaveUser = true
      this.errorMessageForm = 'Apellido debe de tener un mínimo de 3 caracteres'
    } else if (formData.email == '') {
      this.errorFormSaveUser = true
      this.errorMessageForm = 'El campo correo electrónico no puede ir vacío'
      /*} else if (!this.validateEmail(formData.email)) {
        this.errorFormSaveUser = true
        this.errorMessageForm = 'correo electrónico invalido '*/
    } else if (formData.Username == '' || formData.Username.length < 3) {
      this.errorFormSaveUser = true
      this.errorMessageForm = 'Nombre de usuario debe de tener un mínimo de 3 caracteres'
    } else if (formData.password == '' || formData.password.length < 6) {
      this.errorFormSaveUser = true
      this.errorMessageForm = 'El campo contraseña debe ser mayor o igual a 6 caracteres'
    } else if (formData.Repetpass == '' || formData.Repetpass.length < 6) {
      this.errorFormSaveUser = true
      this.errorMessageForm = 'El campo repetir contraseña debe ser mayor o igual a 6 caracteres'
    } else if (formData.password != formData.Repetpass) {
      this.errorFormSaveUser = true
      this.errorMessageForm = 'Las contraseñas no coinciden'
    } else {
      this.cuentasService.createUser(formData).subscribe({
        next: (res: any) => {
          console.log(res)
          this.errorFormSaveUser = false
          if (res.error == false) {
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

  // Editar usuario (Ready)
  editUserManager(formData: any) {
    console.log(formData);
    console.log('Entre aqui editUserManager()')
    let validSet, emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    if (emailRegex.test(formData.email)) { validSet = 1; } else { validSet = 2; }

    if (formData.nameEdit == '' || formData.nameEdit == null) {
      this.errorFormSaveUser = true
      this.errorMessageForm = 'Nombre debe de tener un mínimo de 3 caracteres'
    } else if (formData.lastNameEdit == '' || formData.lastNameEdit == null) {
      this.errorFormSaveUser = true
      this.errorMessageForm = 'Apellido debe de tener un mínimo de 3 caracteres'
    } else if (formData.email == '') {
      this.errorFormSaveUser = true
      this.errorMessageForm = 'El campo correo electrónico no puede ir vacío'
      /*} else if (!this.validateEmail(formData.email)) {
        this.errorFormSaveUser = true
        this.errorMessageForm = 'correo electrónico invalido'*/
    } else if (formData.UsernameEdit == '') {
      this.errorFormSaveUser = true
      this.errorMessageForm = 'Nombre de usuario debe de tener un mínimo de 3 caracteres'
    } else if (formData.password == '') {
      this.errorFormSaveUser = true
      this.errorMessageForm = 'El campo contraseña debe ser mayor o igual a 6 caracteres'
    } else if (formData.Repetpass == '') {
      this.errorFormSaveUser = true
      this.errorMessageForm = 'El campo repetir contraseña debe ser mayor o igual a 6 caracteres'
    } else if (formData.password != formData.Repetpass) {
      this.errorFormSaveUser = true
      this.errorMessageForm = 'Las contraseñas no coinciden'
    } else {
      this.cuentasService.editUserManager(formData).subscribe({
        next: (res: any) => {
          console.log(res)
          this.errorFormSaveUser = false
          if (res.error == false) {
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

  //(Ready)
  setPhone(phone: number) {
    this.phoneEditPass = phone
  }

  // Editar contraseña (Ready)
  editPasswordManager(formData: any, phoneNumber: number) {
    console.log(formData)
    console.log(formData.passwordSet)

    if (formData.passwordEdit == '' || formData.passwordEdit == null || formData.passwordEdit.trim().length < 3) {
      this.errorFormSaveUser = true
      this.errorMessageForm = 'El campo de contraseña no puede estar vacío y debe tener más de 3 caracteres'
    } else if (formData.passwordEditTwo == '' || formData.passwordEditTwo == null) {
      this.errorFormSaveUser = true
      this.errorMessageForm = 'El campo repetir contraseña no puede ir vacío'
    } else if (formData.passwordEdit == '' != formData.passwordEditTwo == null) {
      this.errorFormSaveUser = true
      this.errorMessageForm = 'El campo contraseña y repetir contraseña no son iguales'
    } else {
      this.cuentasService.editPassword(formData).subscribe({
        next: (res: any) => {
          console.log(res)
          this.errorFormSaveUser = false
          if (res.error == false) {
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
  /*
    userList() {
      this.cuentasService.userList().subscribe({
        next: (data: any) => {
          this.userListDtoModel = [];
          this.allData = data
          console.log(data)
          // Filtrar usuarios del sistema
          let toddlers = data.filter(item => item.typeUser == 2)
  
          for (const element of toddlers) {
            let listadoUser = new UserListDto();
            listadoUser.id = element.id;
            listadoUser.name = element.name.trim();
            listadoUser.lastName = element.lastName.trim();
            listadoUser.balance = element.balance;
            listadoUser.phoneNumber = element.phoneNumber;
            listadoUser.address = element.address;
            listadoUser.createdDate = element.createdDate;
            listadoUser.active = element.active;
            listadoUser.username = element.username;
            listadoUser.email = element.email;
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
    }*/

  //(Ready)
  userList() {
    this.cuentasService.userList().subscribe({
      next: (data: any) => {
        this.userListDtoModel = [];
        this.allData = data
        console.log(data)

        for (const element of data) {
          let listadoUser = new UserListDto();
          listadoUser.id = element.id;
          listadoUser.name = element.nombre.trim();
          listadoUser.lastName = element.apellido.trim();
          listadoUser.address = element.direccion;
          listadoUser.createdDate = element.fecha_creacion;
          listadoUser.active = element.estado;
          listadoUser.username = element.username;
          listadoUser.email = element.correo;
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

  // Desactivar usuario (Ready)
  userDisabled(id: number) {

    Swal.fire({
      title: 'Alerta!',
      text: "Seguro que quieres desactivar este usuario ?",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonColor: '#5e72e4',
      cancelButtonColor: '#f5365c',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.isConfirmed) {

        this.cuentasService.userDisabled(id).subscribe({
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

  // Activar usuario (Ready)
  userActive(id: number) {

    Swal.fire({
      title: 'Alerta!',
      text: "Seguro que quieres activar este usuario ?",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonColor: '#5e72e4',
      cancelButtonColor: '#f5365c',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.isConfirmed) {

        this.cuentasService.userActive(id).subscribe({
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

  // Eliminar usuario
  deleteUserManager(id: number) {
    Swal.fire({
      title: 'Alerta!',
      text: "Seguro que quieres eliminar este usuario ?",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonColor: '#5e72e4',
      cancelButtonColor: '#f5365c',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cuentasService.deleteUserManager(id).subscribe({
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

  // Rellenar campos para editar (Ready)
  refillEditUser(data: any) {
    this.nameEdit = data.name
    this.lastNameEditSet = data.lastName
    this.phoneEditSet = data.phoneNumber
    this.emailEditSet = data.email.trim()
    this.usernameEditSet = data.username
  }


}
