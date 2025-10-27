import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { TableComponent } from './table/table.component';
import { CrearComponent } from './crear/crear.component';
import { DetalleCocheComponent } from './detalle-coche/detalle-coche.component';
import { EditarComponent } from './editar/editar.component';

export const routes: Routes = [

  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'crear', component: CrearComponent},
  { path: 'detalle/:id', component: DetalleCocheComponent},
  { path: 'editar/id', component: EditarComponent},
  { path: 'table', component: TableComponent}

];
