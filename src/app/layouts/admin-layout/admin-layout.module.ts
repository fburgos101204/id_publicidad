import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClipboardModule } from 'ngx-clipboard';

import { PhoneFormatPipe } from '../../pipe/phone-format.pipe';
import { TimeFormat } from '../../pipe/convertFrom24To12Format.pipe';

import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { UsersComponent } from '../../pages/users/users.component';
import { LotteryComponent } from '../../pages/lottery/lottery.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WinnersComponent } from 'src/app/pages/winners/winners.component';
import { CuentasComponent } from 'src/app/pages/cuentas/cuentas.component';
import { NgxLoadingModule } from "ngx-loading";
import { ResultadoComponent } from 'src/app/pages/resultados/resultados.component';
import { LocalidadesComponent } from 'src/app/pages/localidades/localidades.component';
import { PublicidadComponent } from 'src/app/pages/publicidad/publicidad.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule,
    NgxLoadingModule.forRoot({}),
  ],
  declarations: [
    DashboardComponent,
    PhoneFormatPipe,
    TimeFormat,
    TablesComponent,
    IconsComponent,
    UsersComponent,
    LotteryComponent,
    WinnersComponent,
    CuentasComponent,
    ResultadoComponent,
    LocalidadesComponent,
    PublicidadComponent,
  ]
})

export class AdminLayoutModule {}
