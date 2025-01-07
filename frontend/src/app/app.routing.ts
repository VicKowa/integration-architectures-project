import { NgModule } from '@angular/core';
import {Routes, RouterModule, provideRouter, withComponentInputBinding} from '@angular/router';
import {LoginPageComponent} from './pages/login-page/login-page.component';
import {LandingPageComponent} from './pages/landing-page/landing-page.component';
import {AuthGuardService} from './services/auth-guard.service';
import {ExamplePageComponent} from './pages/example-page/example-page.component';
import {NotFoundPageComponent} from './pages/not-found-page/not-found-page.component';
import {TestPageComponent} from './pages/test-page/test-page.component';
import {SalesmanDetailsComponent} from './pages/salesman-details-page/salesman-details.component';
import {CreateEvaluationComponent} from '@app/pages/create-evaluation/create-evaluation.component';
import {SalesmanValuconComponent} from "@app/pages/salesman-valucon-page/salesman-valucon.component";
import {SalesmanRegisterComponent} from "@app/salesman-register-page/salesman-register-page.component";
import {ListEvaluationComponent} from '@app/pages/list-evaluation/list-evaluation.component';
import {provideHttpClient} from "@angular/common/http";

/*
  This array holds the relation of paths and components which angular router should resolve.

  If you want add a new page with a separate path/subdirectory you should register it here.
  It is also possible to read parameters from the path they have to be specified with ':' in the path.

  If a new page should also show up in the menu bar, you need to add it there too.
  Look at: frontend/src/app/components/menu-bar/menu-bar.component.ts
 */
const routes: Routes = [
    {path: 'login', component: LoginPageComponent},
    {path: 'register', component: SalesmanRegisterComponent},
    {path: 'example', component: ExamplePageComponent, canActivate: [AuthGuardService]},
    {path: 'test', component: TestPageComponent, canActivate: [AuthGuardService]},
    {path: 'eval/create', component: CreateEvaluationComponent, canActivate: [AuthGuardService]},
    {path: 'eval/list', component: ListEvaluationComponent, canActivate: [AuthGuardService]},
    {path: 'salesman/:sid', component: SalesmanDetailsComponent, canActivate: [AuthGuardService]},
    {path: 'salesman/valucon/:sid', component: SalesmanValuconComponent, canActivate: [AuthGuardService]},
    {path: '', component: LandingPageComponent, canActivate: [AuthGuardService]},
    {path: '**', component: NotFoundPageComponent} // these entries are matched from top to bottom => not found should be the last entry
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ],
    providers: [
        provideHttpClient(),
        provideRouter(routes, withComponentInputBinding())
    ]
})
export class AppRouting { }
