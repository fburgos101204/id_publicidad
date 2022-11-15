import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ResultadoService } from './resultados.service'
import { LotteryService } from '../lottery/lottery.service'
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2'
declare const $: any;

@Component({
  selector: 'app-reporte-resultado',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css']
})
export class ResultadoComponent implements OnInit {

  @ViewChild('createReporteTicket', { read: NgForm }) createReporteTicket: any;

  allData: any
  dataAvailable: boolean = false
  dataUnavailable: boolean = false
  dataToShow: any
  title: string = 'Monitoreo'
  titleTwo: string = 'monitoreo'
  closeResult: string = ''
  showLoaderSave = false
  errorFormSave: boolean = false
  errorMessageForm: string
  dataToShowLottery: any
  allDataLottery: any
  dataDateScrapping: any

  // Modal Datos
  lotteryNameSet: string
  dateCreatedSet: any
  dataToShowModal: any
  numberOneSet: number
  numberTwoSet: number
  numberThreeeSet: number
  amountSet: number
  typePlaySet: string
  idPlay: number


  datosTable: any = {
    dom: 'Bfrtip',
    language: {
      url: "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json",
      searchBuilder: {
        button: 'Filtrar por',
        columns: [3],
        add: 'Agregar condición',
        condition: 'condición',
        data: 'Filtrar por',
        clearAll: 'Reiniciar',
        delete: 'Eliminar',
        left: 'Izquierda',
        logicAnd: 'AND',
        logicOr: 'OR',
        value: 'Listado',
        title: {
          0: 'Filtrar por cualquier columna',
          _: 'Filtrar por cualquier columna (%d)',
        },
        conditions: {
          date: {
            after: 'Después de',
            before: 'Antes de',
            between: 'Entre',
            empty: 'Vacío',
            equals: 'Igual a',
            not: 'Diferente de',
            notBetween: 'No entre',
            notEmpty: 'No vacío'
          },
          string: {
            contains: 'Contiene',
            empty: 'Vacío',
            notEmpty: 'No vacío',
            equals: 'Igual a',
            not: 'No',
            endsWith: 'Termina con',
            startsWith: 'Comienza con'
          },
          moment: {
            before: 'Antes de',
            after: 'Después de',
            equals: 'Igual a',
            not: 'No',
            between: 'Entre',
            notBetween: 'No entre',
            empty: 'Vacío',
            notEmpty: 'No vacío'
          },
          number: {
            equals: 'Igual a',
            not: 'Diferente de',
            gt: 'Mayor a',
            gte: 'Mayor o igual a',
            lt: 'Menor que',
            lte: 'Menor o igual a',
            between: 'Entre',
            notBetween: 'No vacío',
            empty: 'Vacío',
            notEmpty: 'No vacío'
          },
        }
      }
    },
    buttons: [
      'searchBuilder',
      {
        extend: 'pdfHtml5',
        messageTop: 'Reporte de pagos',
      },
      'copy', 'csv', 'excel', 'print'
    ],
    initComplete: function () {
      this.api()
        .columns()
        .every(function () {
          var column = this;
          var select = $('<select><option value=""></option></select>')
            .appendTo($(column.footer()).empty())
            .on('change', function () {
              var val = $.fn.dataTable.util.escapeRegex($(this).val());

              column.search(val ? '^' + val + '$' : '', true, false).draw();
            });

          column
            .data()
            .unique()
            .sort()
            .each(function (d, j) {
              select.append('<option value="' + d + '">' + d + '</option>');
            });
        });
    },
  };

  constructor(
    private router: Router,
    private resultadoService: ResultadoService,
    private lotteryService: LotteryService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    let setting = this.datosTable
    let title = this.title
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login'])
    }
    this.listWinners()
    this.scrappingLastInsert()
    //this.listWinnersScrapping()
    setTimeout(function () {
      $(function () {
        $('#tableMonitoreo').DataTable();
      });
    }, 7000);
  }

  open(monitoreo: any) {
    this.modalService.open(monitoreo, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
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

  formatCero(number) {
    let value;
    if (number == 0) {
      value = number+'0'
    } else if (number < 10) {
      value = '0' + number
    } else {
      value = number
    }

    return value
  }

  listWinners() {
    this.resultadoService.listWinners().subscribe({
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

  generateScrapping() {

    Swal.fire({
      title: 'Cargando',
      html: 'Espere unos minutos mientras se ejecuta la funcion',
      timer: 40000,
      timerProgressBar: true,
      backdrop: false,
      didOpen: () => {
        Swal.showLoading()
      },
      willClose: () => {}
    }).then((result) => {
      this.listWinners()
      this.scrappingLastInsert()
    })

    this.resultadoService.generateScrapping().subscribe({
      next: (data) => {
        //this.listWinners()
      },
      error: (error) => {
        console.log('Error: generateScrapping()')
        console.log(error)
      },
    })
  }

  formatNumber(textNumber) {
    let text = textNumber.replace(/\D/g, "")
    console.log(text.replace(/\D/g, ""))
    let result = text.substr(0, 2);
    let result1 = text.substr(2, 2);
    let result2 = text.substr(4, 2);

    return result + ' - ' + result1 + ' - ' + result2;
  }

  scrappingLastInsert(){
    this.resultadoService.scrappingLastInsert().subscribe({
      next: (data) => {
        console.log('scrappingLastInsert()')
        console.log(data[0])
        if (!data || data == '' || data == '[]') {
          this.dataAvailable = false
          this.dataUnavailable = true
        } else {
          this.dataDateScrapping = data[0].timeRun
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
