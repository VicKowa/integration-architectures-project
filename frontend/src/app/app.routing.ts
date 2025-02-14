import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { SalesmanListPageComponent } from '@app/pages/salesman-list-page/salesman-list-page.component';
import { SalesmanDetailsComponent } from './pages/salesman-details-page/salesman-details.component';
import { CreateEvaluationComponent } from '@app/pages/create-evaluation/create-evaluation.component';
import { SalesmanVaculonComponent } from '@app/pages/salesman-vaculon-page/salesman-vaculon.component';
import { ListEvaluationComponent } from '@app/pages/list-evaluation/list-evaluation.component';
import { SalesmanRegisterComponent } from '@app/pages/salesman-register-page/salesman-register-page.component';
import { SalesmanVaculonListPageComponent } from '@app/pages/salesman-vaculon-list-page/salesman-vaculon-list-page.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
    { path: 'login', component: LoginPageComponent },
    { path: 'register', component: SalesmanRegisterComponent },
    { path: 'eval/create/:sid/:year', component: CreateEvaluationComponent, canActivate: [authGuard] },
    { path: 'eval/view/:sid/:year', component: CreateEvaluationComponent, canActivate: [authGuard] },
    { path: 'eval/list', component: ListEvaluationComponent, canActivate: [authGuard] },
    { path: 'salesman/vaculon/list', component: SalesmanVaculonListPageComponent, canActivate: [authGuard] },
    { path: 'salesman/vaculon/:sid', component: SalesmanVaculonComponent, canActivate: [authGuard] },
    { path: 'salesman/list', component: SalesmanListPageComponent, canActivate: [authGuard] },
    { path: 'salesman/:sid', component: SalesmanDetailsComponent, canActivate: [authGuard] },
    { path: '', component: LandingPageComponent, canActivate: [authGuard] },
    { path: '**', component: NotFoundPageComponent } // Wildcard route for a 404 page
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRouting {}
