import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginRouteGuardService } from './services/login-route-guard.service';

import { LoginComponent } from './shared/pages/login.component';
import { AdminComponent } from './shared/pages/admin.component';
import { ContactComponent } from './shared/pages/contact.component';
import { HomeComponent } from './shared/pages/home.component';
import { ErrorComponent } from './shared/pages/error.component';
import { TestComponent } from './shared/pages/test.component';
import { DemoWorkerComponent } from './shared/pages/demo-worker.component';

const routes: Routes = [
  { path: '', redirectTo:'/home', pathMatch:'full' },
  { path: 'home', component: HomeComponent },
  { path: 'products', loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)},
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [LoginRouteGuardService] },
  { path: 'test', component: TestComponent },
  { path: 'worker', component: DemoWorkerComponent },
  { path: 'error', component: ErrorComponent },
  { path: '**', redirectTo:'/error?status=404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
})],
  exports: [RouterModule],
})
export class AppRoutingModule { }
