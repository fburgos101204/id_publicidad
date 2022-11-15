import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { UsersComponent } from '../../pages/users/users.component';
import { LotteryComponent } from '../../pages/lottery/lottery.component';
import { WinnersComponent } from 'src/app/pages/winners/winners.component';
import { CuentasComponent } from 'src/app/pages/cuentas/cuentas.component';
import { ResultadoComponent } from 'src/app/pages/resultados/resultados.component';
import { LocalidadesComponent } from 'src/app/pages/localidades/localidades.component';
import { PublicidadComponent } from 'src/app/pages/publicidad/publicidad.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'tables',         component: TablesComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'clientes',       component: UsersComponent },
    { path: 'loterias',       component: LotteryComponent },
    { path: 'cuentas',      component: CuentasComponent },
    { path: 'resultados',      component: ResultadoComponent },
    { path: 'localidades',      component: LocalidadesComponent },
    { path: 'publicidad',      component: PublicidadComponent },
];
