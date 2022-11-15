import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-primary', class: '' },
    { path: '/loterias', title: 'Loterías',  icon: 'fas fa-dice-six text-black', class: '' },
    { path: '/resultados', title: 'Resultados',  icon:'ni ni-circle-08 text-yellow', class: '' },
    { path: '/localidades', title: 'Localidades',  icon:'fas fa-book text-blue', class: '' },
    { path: '/publicidad', title: 'Publicidad',  icon:'ni ni-circle-08 text-green', class: '' },
    { path: '/cuentas', title: 'Cuentas',  icon:'ni ni-circle-08 text-pink', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;

  constructor(private router: Router) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
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
      confirmButtonColor: '#5e72e4',
      cancelButtonColor: '#f5365c',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token')
        localStorage.removeItem('rol')
        localStorage.removeItem('nombreCliente')
        return this.router.navigate(['/login'])
      }
    })
  }
}
