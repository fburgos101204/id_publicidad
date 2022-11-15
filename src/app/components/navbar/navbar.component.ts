import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { UsersService } from '../../pages/users/users.service'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public focus;
  public listTitles: any[];
  public location: Location;
  dataToShowInfo: any
  nombreClienteSet: string = '' || localStorage.getItem('nombreCliente')
  constructor(
    location: Location,
    private element: ElementRef,
    private router: Router,
    private usersService: UsersService
  ) {
    this.location = location;
  }

  ngOnInit() {
    this.listTitles = ROUTES.filter(listTitle => listTitle);
      if (!localStorage.getItem('token')) {
        this.router.navigate(['/login'])
      }

    this.userInfo()
  }

  Logout() {
    //This is missing a method to destroy session
    /*this.adminLayoutService.destroySession().subscribe((data) => {
      console.log(data)
    })*/
    Swal.fire({
      title: 'Alerta!',
      text: "Seguro que quieres cerrar sesion?",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token')
        localStorage.removeItem('rol')
        localStorage.removeItem('nombreCliente')
        //window.location.reload(); //like here
        localStorage.clear();
        return this.router.navigate(['/login'])
      }
    })
  }

  userInfo() {
    this.usersService.userInfo().subscribe({
      next: (data) => {
        console.log(data)
        this.dataToShowInfo = data
        let dataSet: any = data
        console.log(dataSet[0].nombre+' '+dataSet[0].apellido)
        let userName = dataSet[0].nombre+' '+dataSet[0].apellido
        localStorage.setItem('nombreCliente', userName)
        this.nombreClienteSet = userName;
      },
      error: (error) => {
        console.log('Error: userInfo()')
        console.log(error)
        /*localStorage.removeItem('token')
        localStorage.removeItem('rol')
        localStorage.removeItem('nombreCliente')
        localStorage.clear();*/
        //window.location.reload(); //like here
        return this.router.navigate(['/login'])
      },
    })
  }


  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }

    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return 'Dashboard';
  }

}
