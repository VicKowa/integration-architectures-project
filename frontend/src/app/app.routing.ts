import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { ExamplePageComponent } from './pages/example-page/example-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { SalesmanListPageComponent } from '@app/pages/salesman-list-page/salesman-list-page.component';
import { SalesmanDetailsComponent } from './pages/salesman-details-page/salesman-details.component';
import { CreateEvaluationComponent } from '@app/pages/create-evaluation/create-evaluation.component';
import { SalesmanValuconComponent } from '@app/pages/salesman-valucon-page/salesman-valucon.component';
import { ListEvaluationComponent } from '@app/pages/list-evaluation/list-evaluation.component';
import { SalesmanRegisterComponent } from '@app/pages/salesman-register-page/salesman-register-page.component';
import { SalesmanValuconListPageComponent } from '@app/pages/salesman-valucon-list-page/salesman-valucon-list-page.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
    { path: 'login', component: LoginPageComponent },
    { path: 'register', component: SalesmanRegisterComponent },
    { path: 'example', component: ExamplePageComponent, canActivate: [authGuard] },
    { path: 'eval/create', component: CreateEvaluationComponent, canActivate: [authGuard] },
    { path: 'eval/view', component: CreateEvaluationComponent, canActivate: [authGuard] },
    { path: 'eval/list', component: ListEvaluationComponent, canActivate: [authGuard] },
    { path: 'salesman/valucon/list', component: SalesmanValuconListPageComponent, canActivate: [authGuard] },
    { path: 'salesman/valucon/:sid', component: SalesmanValuconComponent, canActivate: [authGuard] },
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
