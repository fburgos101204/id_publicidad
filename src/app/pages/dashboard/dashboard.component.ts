import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { DashboardService } from './dashboard.service'
declare const $: any;

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "../../variables/charts";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public datasets: any;
  public data: any;
  public salesChart;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  allDataPlaysToday: any
  allDataWinLottery: any
  dataAvailable: boolean = false
  dataUnavailable: boolean = false
  dataToShowPlaysToday: any
  dataToShowWinLottery: any
  fechaSet: any

  // Var Dashboard
  playsCantVar: number
  salesDayVar: number
  totalPlaysAmountVar: number
  allcustomersVar: number
  cantlotteryVar: number
  activeCustomerCant: number
  allpremiosVar: number
  allrecargaVar: number

  datosTable: any = {
    language: {
      url: "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json",
    }
  }

  constructor(
    private dashboardService: DashboardService,
  ) { }

  

  ngOnInit() {

    this.datasets = [
      [0, 20, 10, 30, 15, 40, 20, 60, 60],
      [0, 20, 5, 25, 10, 30, 15, 40, 40]
    ];
    this.data = this.datasets[0];


    var chartOrders = document.getElementById('chart-orders');

    parseOptions(Chart, chartOptions());


    var ordersChart = new Chart(chartOrders, {
      type: 'bar',
      options: chartExample2.options,
      data: chartExample2.data
    });

    var chartSales = document.getElementById('chart-sales');

    this.salesChart = new Chart(chartSales, {
			type: 'line',
			options: chartExample1.options,
			data: chartExample1.data
		});
    let setting = this.datosTable
    // Listado de Servicios
    this.playsCant()
    this.salesDay()
    this.totalPlaysAmount()
    this.allCustomers()
    this.cantLottery()
    this.listPlaysToday()
    this.winByLottery()
    this.activeCustomer()
    this.premios()
    this.recargasList()
    setTimeout(function () {
      $(function () {
        $('.tableDash').DataTable(setting);
      });
    }, 2000);
  }


  public updateOptions() {
    this.salesChart.data.datasets[0].data = this.data;
    this.salesChart.update();
  }

  playsCant() {
    this.dashboardService.playsCant().subscribe({
      next: (data: any) => {
        this.playsCantVar = data[0].playscant
      },
      error: (error) => {
        console.log('Error: ')
        console.log(error)
      },
    })
  }

  salesDay() {
    this.dashboardService.salesDay().subscribe({
      next: (data: any) => {
        this.salesDayVar = data[0].salesday
      },
      error: (error) => {
        console.log('Error: ')
        console.log(error)
      },
    })
  }

  totalPlaysAmount() {
    this.dashboardService.totalPlaysAmount().subscribe({
      next: (data: any) => {
        //let totalPlaysAmountFilter = data.filter(item => item.typeUser == 2)
        this.totalPlaysAmountVar = data[0].salesday
      },
      error: (error) => {
        console.log('Error: ')
        console.log(error)
      },
    })
  }

  // Total de Venta en recargas
  recargasList() {
    this.dashboardService.recargasList().subscribe({
      next: (data: any) => {
        console.log('Recargas total')
        console.log(data)
        this.allrecargaVar = data[0].recarga
      },
      error: (error) => {
        console.log('Error: ')
        console.log(error)
      },
    })
  }

  allCustomers() {
    this.dashboardService.allCustomers().subscribe({
      next: (data: any) => {
        this.allcustomersVar = data[0].allcustomers
      },
      error: (error) => {
        console.log('Error: ')
        console.log(error)
      },
    })
  }

  premios() {
    this.dashboardService.premios().subscribe({
      next: (data: any) => {
        console.log('Premio total')
        console.log(data)
        this.allpremiosVar = data[0].premios
      },
      error: (error) => {
        console.log('Error: ')
        console.log(error)
      },
    })
  }

  cantLottery() {
    this.dashboardService.cantLottery().subscribe({
      next: (data: any) => {
        this.cantlotteryVar = data[0].cantlottery
      },
      error: (error) => {
        console.log('Error: ')
        console.log(error)
      },
    })
  }

  listPlaysToday() {
    this.dashboardService.listPlaysToday().subscribe({
      next: (data) => {
        this.allDataPlaysToday = data
        console.log(data)
        if (!data || data == '' || data == '[]') {
          this.dataAvailable = false
          this.dataUnavailable = true
        } else {
          this.dataToShowPlaysToday = data
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

  winByLottery() {
    let d = new Date()
    let fecha = d.getMonth()+1 + "/" + d.getDate() + "/" + d.getFullYear();
    this.dashboardService.winByLottery().subscribe({
      next: (data) => {
        this.allDataWinLottery = data
        console.log(data)
        if (!data || data == '' || data == '[]') {
          this.dataAvailable = false
          this.dataUnavailable = true
        } else {
          this.fechaSet = fecha
          this.dataToShowWinLottery = data
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
 
  // CLIENTES ACTIVOS
  activeCustomer(){
    this.dashboardService.activeCustomer().subscribe({
      next: (data: any) => {
        console.log('Clientes Activos')
        console.log(data)
        console.log(data[0].activecustomer)
        this.activeCustomerCant = data[0].activecustomer
      },
      error: (error) => {
        console.log('Error: ')
        console.log(error)
      },
    })
  }

}
