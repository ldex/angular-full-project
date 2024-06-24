import { Routes } from '@angular/router';
import { loginRouteGuard } from './login-route.guard';
import { AdminComponent } from './shared/pages/admin.component';
import { ContactComponent } from './shared/pages/contact.component';
import { DemoWorkerComponent } from './shared/pages/demo-worker.component';
import { ErrorComponent } from './shared/pages/error.component';
import { HomeComponent } from './shared/pages/home.component';
import { LoginComponent } from './shared/pages/login.component';
import { TestComponent } from './shared/pages/test.component';

export const routes: Routes = [
    { path: '', redirectTo:'/home', pathMatch:'full' },
    { path: 'home', component: HomeComponent },
    { path: 'products', loadChildren: () => import('./products/products.routes').then(r => r.productsRoutes) },
    { path: 'contact', component: ContactComponent },
    { path: 'login', component: LoginComponent },
    { path: 'admin', component: AdminComponent, canActivate: [loginRouteGuard] },
    { path: 'test', component: TestComponent },
    { path: 'worker', component: DemoWorkerComponent },
    { path: 'error', component: ErrorComponent },
    { path: '**', redirectTo:'/error?status=404' }
];