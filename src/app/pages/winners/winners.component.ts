import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WinnersService } from './winners.service'
import Swal from 'sweetalert2'
declare const $: any;

@Component({
  selector: 'app-winners',
  templateUrl: './winners.component.html',
  styleUrls: ['./winners.component.css']
})
export class WinnersComponent implements OnInit {

  allData: any
  dataAvailable: boolean = false
  dataUnavailable: boolean = false
  dataToShow: any
  title: string = 'Ganadores'
  titleTwo: string = 'ganadores'

  datosTable: any = {
    language: {
      url: "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json",
    }
  }

  constructor(
    private router: Router,
    private winnersService: WinnersService
  ) { }

  ngOnInit(): void {
    let setting = this.datosTable
    let title = this.title
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login'])
    }
    this.listWinners()
    setTimeout(function () {
      $(function () {
        $('#tableCitys').DataTable(setting);
      });
    }, 1000);
  }

  listWinners(){
    this.winnersService.listWinners().subscribe({
      next: (data) => {
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

}
